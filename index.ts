import { ts, Plugin, PluginContext } from 'dtsgenerator';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const packageJson: {
    name: string;
    version: string;
    description: string;
    // eslint-disable-next-line @typescript-eslint/no-var-requires
} = require('./package.json');

const singleQuote: Plugin = {
    meta: {
        name: packageJson.name,
        version: packageJson.version,
        description: packageJson.description,
    },
    postProcess,
};

// eslint-disable-next-line @typescript-eslint/require-await
async function postProcess(
    _pluginContext: PluginContext,
): Promise<ts.TransformerFactory<ts.SourceFile> | undefined> {
    return (context: ts.TransformationContext) =>
        (root: ts.SourceFile): ts.SourceFile => {
            function visit<T extends ts.Node>(node: T): T {
                node = ts.visitEachChild(node, visit, context);

                if (ts.isStringLiteral(node)) {
                    // `singleQuote` is internal property.
                    // via: https://github.com/microsoft/TypeScript/blob/v3.9.2/src/compiler/types.ts#L1353
                    (
                        node as unknown as {
                            singleQuote: boolean;
                        }
                    ).singleQuote = true;
                }

                return node;
            }
            return ts.visitNode(root, visit, ts.isSourceFile);
        };
}

export default singleQuote;
