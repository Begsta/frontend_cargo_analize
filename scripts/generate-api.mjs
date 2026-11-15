import { readFile, writeFile } from 'node:fs/promises';

// Генерация типов и Axios-методов из OpenAPI FastAPI.
const schemaPath = new URL('../src/api/openapi.json', import.meta.url);
const schema = JSON.parse(await readFile(schemaPath, 'utf8'));
function typeOf(s = {}) {
  if (s.$ref) return s.$ref.split('/').at(-1);
  if (s.anyOf) return s.anyOf.map(typeOf).join(' | ');
  if (s.enum) return s.enum.map(x => JSON.stringify(x)).join(' | ');
  if (s.type === 'array') return `Array<${typeOf(s.items)}>`;
  if (s.type === 'object') {
    return '{\n' + Object.entries(s.properties || {}).map(([k, v]) =>
      `  ${k}${s.required?.includes(k) ? '' : '?'}: ${typeOf(v)};`
    ).join('\n') + '\n}';
  }
  if (s.format === 'binary'
    || s.contentMediaType === 'application/octet-stream') return 'File';
  return ({ integer: 'number', number: 'number', string: 'string',
    boolean: 'boolean', null: 'null' })[s.type] || 'unknown';
}
const operations = [
  ['getCargos', 'get', '/api/cargos'],
  ['getCargoFeed', 'get', '/api/cargos/feed'],
  ['getCargoDraft', 'get', '/api/cargos/draft'],
  ['createCargoDraft', 'post', '/api/cargos'],
  ['publishCargo', 'put', '/api/cargos/{cargo_id}'],
  ['deleteCargo', 'delete', '/api/cargos/{cargo_id}'],
  ['setCargoInterest', 'post', '/api/cargos/{cargo_id}/likes'],
];
let output = '// Generated from openapi.json. Run npm run api:generate.\n';
output += "import { http } from '../http';\n\n";
for (const [name, value] of Object.entries(schema.components.schemas)) {
  output += `export type ${name} = ${typeOf(value)};\n\n`;
}
for (const [name, method, path] of operations) {
  const op = schema.paths[path]?.[method];
  if (!op) throw Error(`OpenAPI operation missing: ${method} ${path}`);
  const parameters = op.parameters || [];
  const args = [];
  for (const p of parameters.filter(p => p.in === 'path')) {
    args.push(`${p.name}: ${typeOf(p.schema)}`);
  }
  const query = parameters.filter(p => p.in === 'query');
  if (query.length) {
    const fields = query.map(p =>
      `${p.name}${p.required ? '' : '?'}: ${typeOf(p.schema)}`
    ).join('; ');
    args.push(`params: { ${fields} } = {}`);
  }
  const content = op.requestBody?.content;
  const multipart = !!content?.['multipart/form-data'];
  if (content) {
    const body = Object.values(content)[0].schema;
    args.push(`body${op.requestBody.required ? '' : '?'}: ${typeOf(body)}`);
  }
  const response = Object.entries(op.responses).find(([code]) =>
    code.startsWith('2'))?.[1];
  const result = response?.content?.['application/json']?.schema;
  const url = path.replace(/\{(\w+)\}/g, '${$1}');
  output += `export async function ${name}(${args.join(', ')}) {\n`;
  if (multipart) {
    output += '  const data = new FormData();\n';
    output += '  Object.entries(body).forEach(([key, value]) => {\n';
    output += '    data.append(key, value);\n  });\n';
  }
  output += `  const response = await http.request<${result ? typeOf(result) : 'void'}>({\n`;
  output += `    method: '${method.toUpperCase()}', url: \`${url}\`,\n`;
  if (query.length) output += '    params,\n';
  if (content) output += `    data: ${multipart ? 'data' : 'body'},\n`;
  output += '  });\n  return response.data;\n}\n\n';
}
await writeFile(new URL('../src/api/generated/cargoApi.ts', import.meta.url), output);
