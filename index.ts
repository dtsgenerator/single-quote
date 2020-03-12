import { Plugin, PluginContext } from 'dtsgenerator';
import ts from 'typescript';

const singleQuote: Plugin = {
    meta: {
        description: 'Change all quotation to single',
    },
    create,
};

async function create(_pluginContext: PluginContext): Promise<ts.TransformerFactory<ts.Statement> | undefined> {
    return (context: ts.TransformationContext) => (root: ts.Statement): ts.Statement => {
        function visit(node: ts.Node) {
            node = ts.visitEachChild(node, visit, context);

            if (ts.isStringLiteral(node)) {
                // that property is internal. via: https://github.com/microsoft/TypeScript/blob/v3.8.3/src/compiler/types.ts#L1352
                (node as any).singleQuote = true;
            }

            return node;
        }
        return ts.visitNode(root, visit);
    };
}

export default singleQuote;
