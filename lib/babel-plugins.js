export default function (babel) {
  
  const { types: t } = babel;
  
  function deprecateAliasToAlias(path) {
    const { decorators } = path.node;
    const updatedDecorators = decorators.map(decorator => {
      if (decorator.expression && 
          decorator.expression.type === 'CallExpression' &&
          decorator.expression.callee.name === 'deprecatingAlias') {
        return t.decorator(
          t.callExpression(
            t.Identifier('alias'),
            [decorator.expression.arguments[0]]
          )
        );
      }
      return decorator;
    });
    path.node.decorators = updatedDecorators;
  }
  
  return {
    visitor: {
      ImportDeclaration(path) {
        if (path.node.source.value === 'ember-decorators/object/computed') {
          path.node.specifiers = path.node.specifiers.map(specifier => {
            if (specifier.imported.name === 'deprecatingAlias') {
              return t.importSpecifier(t.Identifier('alias'), t.Identifier('alias'));
            } else {
              return specifier;
            }
          });
        }
      },
      ClassProperty(path) {
        return deprecateAliasToAlias(path);
      },
      ObjectProperty(path) {
        return deprecateAliasToAlias(path);
      }
    }
  };
}
