function expressionValue(source: string, variables: Record<string, string | number>) {
  const values = source.split(/\s*\+\s*/).map(token => {
    const value = token.trim();
    if (/^"[\s\S]*"$/.test(value)) return value.slice(1, -1).replaceAll('\\n', '\n');
    if (/^-?\d+(?:\.\d+)?$/.test(value)) return Number(value);
    if (value in variables) return variables[value];
    throw new Error(`Expressão ainda não suportada pelo runner: ${value}`);
  });
  const [first = '', ...rest] = values;
  return rest.reduce<string | number>((result, value) => typeof result === 'number' && typeof value === 'number'
    ? result + value
    : `${result}${value}`, first);
}

export function executeJavaSubset(source: string) {
  let output = '';
  const variables: Record<string, string | number> = {};
  const cleaned = source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  const loops: Array<{ name: string; start: number; end: number; inclusive: boolean; body: string }> = [];
  const withoutLoops = cleaned.replace(/for\s*\(\s*int\s+(\w+)\s*=\s*(-?\d+)\s*;\s*\1\s*(<|<=)\s*(-?\d+)\s*;\s*\1\+\+\s*\)\s*\{([\s\S]*?)\}/g, (_, name: string, start: string, operator: string, end: string, body: string) => {
    loops.push({ name, start: Number(start), end: Number(end), inclusive: operator === '<=', body });
    return '';
  });
  const executeStatements = (block: string) => {
    const executable = block
      .replace(/(?:public\s+)?class\s+\w+\s*\{/g, '')
      .replace(/public\s+static\s+void\s+main\s*\([^)]*\)\s*\{/g, '')
      .replace(/\}/g, '');
    for (const raw of executable.split(';')) {
      const statement = raw.replace(/[{}]/g, ' ').trim();
      if (!statement || /^(public\s+class|class\s+|public\s+static\s+void\s+main)/.test(statement)) continue;
      const declaration = statement.match(/^(?:final\s+)?(?:int|long|double|float|String|var)\s+(\w+)\s*=\s*(.+)$/);
      if (declaration) {
        const [, name, expression] = declaration;
        if (name && expression) variables[name] = expressionValue(expression, variables);
        continue;
      }
      const print = statement.match(/^System\.out\.(println|print)\s*\(([\s\S]*)\)$/);
      if (print) {
        const expression = print[2] ?? '';
        const rendered = expression.trim() ? expressionValue(expression, variables) : '';
        output += `${rendered}${print[1] === 'println' ? '\n' : ''}`;
        continue;
      }
      throw new Error(`Este recurso exige o JDK real: ${statement.slice(0, 70)}`);
    }
  };
  executeStatements(withoutLoops);
  for (const loop of loops) {
    let guard = 0;
    for (let value = loop.start; loop.inclusive ? value <= loop.end : value < loop.end; value += 1) {
      variables[loop.name] = value;
      executeStatements(loop.body);
      if (++guard > 500) throw new Error('Laço interrompido após 500 iterações.');
    }
  }
  return output.replace(/\n$/, '') || '(programa finalizado sem saída)';
}
