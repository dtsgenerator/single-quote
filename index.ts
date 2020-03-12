import { Plugin, PluginContext } from 'dtsgenerator';
import ts from 'typescript';

const singleQuote: Plugin = {
    meta: {
        description: 'Replace the namespace names.',
    },
    create,
};

async function create(_pluginContext: PluginContext): Promise<ts.TransformerFactory<ts.SourceFile> | undefined> {
    return (context: ts.TransformationContext) => (root: ts.SourceFile): ts.SourceFile => {
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
