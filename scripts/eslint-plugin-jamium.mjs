// Custom ESLint plugin for Jamium-specific rules
// Handles JSX attribute validation that ast-grep struggles with

export default {
  rules: {
    'no-magic-testids': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Enforce using TestIds constants from fixtures instead of magic strings',
          category: 'Best Practices',
          recommended: true
        },
        messages: {
          useMagicTestId: 'Use TestIds from fixtures, not inline magic strings. Import from @/app/testing/fixtures'
        },
        schema: []
      },
      create(context) {
        // Skip stories files
        const filename = context.getFilename();
        if (filename.includes('.stories.')) {
          return {};
        }

        return {
          JSXAttribute(node) {
            // Check if this is a data-testid attribute
            if (node.name.name !== 'data-testid') return;

            // Only flag string literals (not expressions with variables)
            if (node.value && node.value.type === 'Literal' && typeof node.value.value === 'string') {
              context.report({
                node: node.value,
                messageId: 'useMagicTestId'
              });
            }

            // Also flag inline string templates
            if (node.value &&
                node.value.type === 'JSXExpressionContainer' &&
                node.value.expression.type === 'Literal' &&
                typeof node.value.expression.value === 'string') {
              context.report({
                node: node.value,
                messageId: 'useMagicTestId'
              });
            }
          }
        };
      }
    },

    'no-hardcoded-navigation': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Enforce using pageRoutes constants for navigation paths',
          category: 'Best Practices',
          recommended: true
        },
        messages: {
          usePageRoute: 'Use pageRoutes constants for navigation, not hardcoded paths'
        },
        schema: []
      },
      create(context) {
        // Skip stories files
        const filename = context.getFilename();
        if (filename.includes('.stories.')) {
          return {};
        }

        return {
          // JSX href attributes
          JSXAttribute(node) {
            if (node.name.name !== 'href') return;

            // Check if the value is a string literal starting with /
            if (node.value && node.value.type === 'Literal' &&
                typeof node.value.value === 'string' &&
                node.value.value.startsWith('/')) {
              context.report({
                node: node.value,
                messageId: 'usePageRoute'
              });
            }
          },

          // Function calls like goto(), redirect()
          CallExpression(node) {
            const callee = node.callee;

            // Check for methods: page.goto('/path'), obj.goto('/path')
            if (callee.type === 'MemberExpression' &&
                callee.property.name === 'goto' &&
                node.arguments.length > 0 &&
                node.arguments[0].type === 'Literal' &&
                typeof node.arguments[0].value === 'string' &&
                node.arguments[0].value.startsWith('/')) {
              context.report({
                node: node.arguments[0],
                messageId: 'usePageRoute'
              });
            }

            // Check for redirect('/path')
            if (callee.type === 'Identifier' &&
                callee.name === 'redirect' &&
                node.arguments.length > 0 &&
                node.arguments[0].type === 'Literal' &&
                typeof node.arguments[0].value === 'string' &&
                node.arguments[0].value.startsWith('/')) {
              context.report({
                node: node.arguments[0],
                messageId: 'usePageRoute'
              });
            }
          },

          // Object properties like { href: '/path' }
          Property(node) {
            if (node.key.type === 'Identifier' &&
                node.key.name === 'href' &&
                node.value.type === 'Literal' &&
                typeof node.value.value === 'string' &&
                node.value.value.startsWith('/')) {
              context.report({
                node: node.value,
                messageId: 'usePageRoute'
              });
            }
          }
        };
      }
    },

    'require-function-components': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'Use function keyword for components, not arrow functions',
          category: 'Best Practices',
          recommended: true
        },
        messages: {
          useFunctionDeclaration: 'Use function keyword for components, not arrow functions. Use "export function Component()" not "const Component = () => {}"'
        },
        schema: []
      },
      create(context) {
        // Skip stories, test files, and ui components
        const filename = context.getFilename();
        if (filename.includes('.stories.') ||
            filename.includes('.test.') ||
            filename.includes('.spec.') ||
            filename.includes('/ui/')) {
          return {};
        }

        return {
          VariableDeclaration(node) {
            // Check if this is an export
            const parent = node.parent;
            if (parent.type !== 'ExportNamedDeclaration') return;

            // Check each variable declarator
            for (const declarator of node.declarations) {
              let functionToCheck = declarator.init;

              // Handle memo() and other HOC wrappers
              if (functionToCheck &&
                  functionToCheck.type === 'CallExpression' &&
                  (functionToCheck.callee.name === 'memo' ||
                   functionToCheck.callee.name === 'forwardRef')) {
                // Skip forwardRef
                if (functionToCheck.callee.name === 'forwardRef') {
                  continue;
                }
                // For memo, check its argument
                functionToCheck = functionToCheck.arguments[0];
              }

              // Check if it's an arrow function that returns JSX
              if (functionToCheck &&
                  functionToCheck.type === 'ArrowFunctionExpression') {

                // Check if the body contains JSX
                const body = functionToCheck.body;
                const hasJSX = containsJSX(body);

                if (hasJSX) {
                  context.report({
                    node: declarator,
                    messageId: 'useFunctionDeclaration'
                  });
                }
              }
            }
          }
        };

        function containsJSX(node) {
          if (!node) return false;

          // Direct JSX return
          if (node.type === 'JSXElement' || node.type === 'JSXFragment') {
            return true;
          }

          // Block statement with return
          if (node.type === 'BlockStatement') {
            for (const statement of node.body) {
              if (statement.type === 'ReturnStatement' && statement.argument) {
                if (containsJSX(statement.argument)) return true;
              }
            }
          }

          // Parenthesized expression
          if (node.type === 'ParenthesizedExpression') {
            return containsJSX(node.expression);
          }

          return false;
        }
      }
    },

    'no-direct-tanstack': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'Use feature hooks instead of direct TanStack Query calls',
          category: 'Best Practices',
          recommended: true
        },
        messages: {
          useFeatureHooks: 'Use feature hooks instead of direct TanStack Query calls'
        },
        schema: []
      },
      create(context) {
        // Skip allowed paths
        const filename = context.getFilename();
        if (filename.includes('/hooks/') ||
            filename.includes('/hooks.ts') ||
            filename.includes('.stories.')) {
          return {};
        }

        return {
          ImportDeclaration(node) {
            // Check if importing from @tanstack/react-query
            if (node.source.value === '@tanstack/react-query') {
              // Check for disallowed imports
              const disallowedImports = ['useQuery', 'useMutation', 'useInfiniteQuery'];

              for (const specifier of node.specifiers) {
                if (specifier.type === 'ImportSpecifier' &&
                    disallowedImports.includes(specifier.imported.name)) {
                  context.report({
                    node: specifier,
                    messageId: 'useFeatureHooks'
                  });
                }
              }
            }
          }
        };
      }
    },

    'no-template-classname': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'Use cn() utility instead of template literals for classNames',
          category: 'Best Practices',
          recommended: true
        },
        messages: {
          useCnUtility: 'Use cn() utility instead of template literals for classNames'
        },
        schema: []
      },
      create(context) {
        const templateLiteralVars = new Set();

        return {
          // Track variables that are assigned template literals
          VariableDeclarator(node) {
            if (node.init && node.init.type === 'TemplateLiteral' &&
                node.id.type === 'Identifier') {
              // Check if this template literal contains dynamic parts
              if (node.init.expressions && node.init.expressions.length > 0) {
                templateLiteralVars.add(node.id.name);
              }
            }
          },

          JSXAttribute(node) {
            // Check if this is a className attribute
            if (node.name.name !== 'className') return;

            // Check if the value is a direct template literal with dynamic expressions
            if (node.value &&
                node.value.type === 'JSXExpressionContainer' &&
                node.value.expression.type === 'TemplateLiteral' &&
                node.value.expression.expressions &&
                node.value.expression.expressions.length > 0) {
              context.report({
                node: node.value,
                messageId: 'useCnUtility'
              });
            }

            // Check if the value is a variable that was assigned a template literal
            if (node.value &&
                node.value.type === 'JSXExpressionContainer' &&
                node.value.expression.type === 'Identifier' &&
                templateLiteralVars.has(node.value.expression.name)) {
              context.report({
                node: node.value,
                messageId: 'useCnUtility'
              });
            }
          }
        };
      }
    },

    'e2e-locators-no-getrole': {
      meta: {
        type: 'problem',
        docs: {
          description: 'E2E tests must use getByTestId() with fixture constants, not getByRole()',
          category: 'Testing',
          recommended: true
        },
        messages: {
          useTestId: 'E2E tests must use getByTestId() with fixture constants, not getByRole()'
        },
        schema: []
      },
      create(context) {
        // Only check e2e/locators/*.locators.ts files
        const filename = context.getFilename();
        if (!filename.includes('/e2e/locators/') || !filename.includes('.locators.')) {
          return {};
        }

        return {
          CallExpression(node) {
            // Check for .getByRole() calls
            if (node.callee.type === 'MemberExpression' &&
                node.callee.property.name === 'getByRole') {
              context.report({
                node,
                messageId: 'useTestId'
              });
            }
          }
        };
      }
    },

    'no-unsafe-innerHTML': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Prevent XSS vulnerabilities by disallowing dangerouslySetInnerHTML and innerHTML',
          category: 'Security',
          recommended: true
        },
        messages: {
          unsafeInnerHTML: 'Avoid using dangerouslySetInnerHTML or innerHTML to prevent XSS attacks. Use text content or sanitized HTML instead.'
        },
        schema: []
      },
      create(context) {
        return {
          // Check for dangerouslySetInnerHTML in JSX
          JSXAttribute(node) {
            if (node.name.name === 'dangerouslySetInnerHTML') {
              context.report({
                node,
                messageId: 'unsafeInnerHTML'
              });
            }
          },

          // Check for .innerHTML assignments
          AssignmentExpression(node) {
            if (node.left.type === 'MemberExpression' &&
                node.left.property.name === 'innerHTML') {
              context.report({
                node,
                messageId: 'unsafeInnerHTML'
              });
            }
          }
        };
      }
    },

    'no-exposed-secrets': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Prevent hardcoded secrets, API keys, and tokens in code',
          category: 'Security',
          recommended: true
        },
        messages: {
          exposedSecret: 'Do not hardcode {{type}} in code. Use environment variables or secure configuration.'
        },
        schema: []
      },
      create(context) {
        // Common patterns for secrets
        const secretPatterns = [
          { regex: /api[_-]?key/i, type: 'API keys' },
          { regex: /api[_-]?secret/i, type: 'API secrets' },
          { regex: /auth[_-]?token/i, type: 'auth tokens' },
          { regex: /private[_-]?key/i, type: 'private keys' },
          { regex: /secret[_-]?key/i, type: 'secret keys' },
          { regex: /password/i, type: 'passwords' },
          { regex: /bearer\s+[a-zA-Z0-9\-._~+/]+=*/i, type: 'Bearer tokens' }
        ];

        function isEnvAccess(node) {
          // Check if it's accessing process.env or import.meta.env
          if (node && node.type === 'MemberExpression') {
            if (node.object.type === 'MemberExpression' &&
                node.object.object.name === 'process' &&
                node.object.property.name === 'env') {
              return true;
            }
            if (node.object.type === 'MemberExpression' &&
                node.object.object.type === 'MetaProperty' &&
                node.object.property.name === 'env') {
              return true;
            }
          }
          return false;
        }

        return {
          // Check variable assignments
          VariableDeclarator(node) {
            // Skip if right side is env access
            if (isEnvAccess(node.init)) {
              return;
            }

            if (node.init && node.init.type === 'Literal' &&
                typeof node.init.value === 'string' &&
                node.init.value.length > 10 &&
                node.id.type === 'Identifier') {

              for (const pattern of secretPatterns) {
                if (pattern.regex.test(node.id.name)) {
                  // Check if the value looks like a real secret (not a placeholder)
                  const value = node.init.value;
                  if (!value.includes('YOUR_') &&
                      !value.includes('REPLACE_') &&
                      !value.includes('EXAMPLE') &&
                      !value.toUpperCase().includes('XXX') &&
                      value !== 'v1' &&
                      value.length > 15) {
                    context.report({
                      node: node.init,
                      messageId: 'exposedSecret',
                      data: { type: pattern.type }
                    });
                  }
                }
              }
            }
          },

          // Check object properties
          Property(node) {
            if (node.value.type === 'Literal' &&
                typeof node.value.value === 'string' &&
                node.value.value.length > 10) {

              for (const pattern of secretPatterns) {
                const key = node.key.type === 'Identifier' ? node.key.name : node.key.value;
                if (pattern.regex.test(key)) {
                  const value = node.value.value;
                  if (!value.includes('YOUR_') &&
                      !value.includes('REPLACE_') &&
                      !value.includes('EXAMPLE') &&
                      !value.toUpperCase().includes('XXX') &&
                      value !== 'v1' &&
                      value.length > 15) {
                    context.report({
                      node: node.value,
                      messageId: 'exposedSecret',
                      data: { type: pattern.type }
                    });
                  }
                }
              }
            }
          }
        };
      }
    },

    'no-unhandled-promises': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Ensure all promises have proper error handling',
          category: 'Error Handling',
          recommended: true
        },
        messages: {
          unhandledPromise: 'Add .catch() or try/catch to handle promise rejection'
        },
        schema: []
      },
      create(context) {
        return {
          CallExpression(node) {
            // Check for unhandled fetch, axios, or other promise-returning functions
            const promiseFunctions = ['fetch', 'axios'];
            const calleeName = node.callee.type === 'Identifier' ? node.callee.name :
                              node.callee.type === 'MemberExpression' ? node.callee.object.name : null;

            if (promiseFunctions.includes(calleeName)) {
              // Check if followed by .catch() or .then() in chain
              const parent = node.parent;
              let hasCatch = false;
              let hasChain = false;

              // Check if part of a method chain
              if (parent && parent.type === 'MemberExpression' && parent.object === node) {
                hasChain = true;
                // Walk up the chain to find .catch()
                let current = parent;
                while (current) {
                  if (current.type === 'CallExpression' &&
                      current.callee.type === 'MemberExpression' &&
                      current.callee.property.name === 'catch') {
                    hasCatch = true;
                    break;
                  }
                  // Continue walking up if part of another member expression
                  if (current.parent &&
                      current.parent.type === 'MemberExpression' &&
                      current.parent.object === current) {
                    current = current.parent;
                  } else if (current.parent &&
                           current.parent.type === 'CallExpression' &&
                           current.parent.callee === current) {
                    current = current.parent;
                  } else {
                    break;
                  }
                }
              }

              // Check if inside try block
              let inTry = false;
              let ancestor = node.parent;
              while (ancestor) {
                if (ancestor.type === 'TryStatement') {
                  inTry = true;
                  break;
                }
                ancestor = ancestor.parent;
              }

              // Check if assigned to a variable with await
              const isAwaited = parent && parent.type === 'AwaitExpression';

              // Check if inside async function (await without explicit try/catch is ok)
              let inAsyncFunction = false;
              let funcAncestor = node.parent;
              while (funcAncestor) {
                if ((funcAncestor.type === 'FunctionDeclaration' ||
                     funcAncestor.type === 'FunctionExpression' ||
                     funcAncestor.type === 'ArrowFunctionExpression') &&
                    funcAncestor.async) {
                  inAsyncFunction = true;
                  break;
                }
                funcAncestor = funcAncestor.parent;
              }

              if (!hasCatch && !inTry && !isAwaited && !hasChain && !inAsyncFunction) {
                context.report({
                  node,
                  messageId: 'unhandledPromise'
                });
              }
            }
          }
        };
      }
    },

    'require-zod-validation': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'Ensure API endpoints and server actions have zod validation',
          category: 'Security',
          recommended: true
        },
        messages: {
          missingValidation: 'API endpoints and server actions must validate input with zod schemas'
        },
        schema: []
      },
      create(context) {
        const filename = context.getFilename();

        // Only check API routes and server actions
        if (!filename.includes('/api/') && !filename.includes('.action.')) {
          return {};
        }

        return {
          ExportNamedDeclaration(node) {
            // Check for POST/PUT/PATCH handlers without validation (skip GET)
            if (node.declaration && node.declaration.type === 'FunctionDeclaration') {
              const funcName = node.declaration.id?.name;

              if (['POST', 'PUT', 'PATCH'].includes(funcName)) {
                // Check if function body contains zod parse
                const hasValidation = checkForZodValidation(node.declaration.body);

                if (!hasValidation) {
                  context.report({
                    node: node.declaration,
                    messageId: 'missingValidation'
                  });
                }
              }
            }
          },

          // Check server actions
          FunctionDeclaration(node) {
            if (node.async && node.id && node.id.name.includes('Action')) {
              const hasValidation = checkForZodValidation(node.body);

              if (!hasValidation) {
                context.report({
                  node,
                  messageId: 'missingValidation'
                });
              }
            }
          }
        };

        function checkForZodValidation(body) {
          // Simple check for .parse, .safeParse, or .parseAsync calls
          const sourceCode = context.getSourceCode();
          const bodyText = sourceCode.getText(body);
          return bodyText.includes('.parse(') ||
                 bodyText.includes('.safeParse(') ||
                 bodyText.includes('.parseAsync(');
        }
      }
    }
  }
};
