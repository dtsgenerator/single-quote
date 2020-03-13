import { Plugin, PluginContext } from 'dtsgenerator';
import ts from 'typescript';

async function create(
    _pluginContext: PluginContext
): Promise<ts.TransformerFactory<ts.Statement> | undefined> {
    return (context: ts.TransformationContext) => (
        root: ts.Statement
    ): ts.Statement => {
        function visit(node: ts.Node): ts.Node {
            node = ts.visitEachChild(node, visit, context);

            if (ts.isStringLiteral(node)) {
                // `singleQuote` property is internal. via: https://github.com/microsoft/TypeScript/blob/v3.8.3/src/compiler/types.ts#L1352
                ((node as unknown) as {
                    singleQuote: boolean;
                }).singleQuote = true;
            }

            return node;
        }
        return ts.visitNode(root, visit);
    };
}

const singleQuote: Plugin = {
    meta: {
        description: 'Change all quotation to single'
    },
    create
};

export default singleQuote;
