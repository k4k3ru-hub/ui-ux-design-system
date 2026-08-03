//
// transform.ts
//
import { readFile } from "node:fs/promises";
import { isAbsolute, relative, resolve } from "node:path";

const componentElementPattern = /<x-component\s+name=(["'])([a-z0-9]+(?:-[a-z0-9]+)*)\1\s*>\s*<\/x-component>/gi;

export interface HtmlComponentTransformerOptions { componentsDirectory: string }

export class HtmlComponentTransformer {
    private readonly componentsDirectory: string;

    //
    // Constructor.
    //
    public constructor(options: HtmlComponentTransformerOptions) {
        if (typeof options?.componentsDirectory !== "string" || options.componentsDirectory.trim() === "") {
            throw new TypeError(`invalid parameter: componentsDirectory=${options.componentsDirectory.trim()}`);
        }

        this.componentsDirectory = resolve(options.componentsDirectory);
    }

    public async transform(html: string): Promise<string> {
        if (typeof html !== "string") {
            throw new TypeError("html must be a string");
        }

        return this.expand(html, []);
    }

    private async expand(html: string, dependencyChain: readonly string[]): Promise<string> {
        const pattern = new RegExp(componentElementPattern.source, componentElementPattern.flags);

        const matches = [...html.matchAll(pattern)];

        if (matches.length === 0) {
            return html;
        }

        let transformedHtml = html;

        for (const match of matches) {
            const element = match[0];
            const componentName = match[2];

      if (!componentName) {
        throw new Error(
          `Invalid x-component element: ${element}`,
        );
      }

      const componentPath = this.resolveComponentPath(
        componentName,
      );

      if (dependencyChain.includes(componentPath)) {
        throw new Error(
          `Circular x-component dependency detected: ${[
            ...dependencyChain,
            componentPath,
          ].join(" -> ")}`,
        );
      }

      const componentHtml = await this.readComponent(
        componentName,
        componentPath,
      );

      const expandedHtml = await this.expand(
        componentHtml,
        [...dependencyChain, componentPath],
      );

      transformedHtml = transformedHtml.replace(
        element,
        expandedHtml,
      );
    }

    return this.expand(
      transformedHtml,
      dependencyChain,
    );
  }

  private resolveComponentPath(
    componentName: string,
  ): string {
    const componentPath = resolve(
      this.componentsDirectory,
      componentName,
      "index.html",
    );

    const relativePath = relative(
      this.componentsDirectory,
      componentPath,
    );

    if (
      relativePath === "" ||
      relativePath === ".." ||
      relativePath.startsWith("../") ||
      relativePath.startsWith("..\\") ||
      isAbsolute(relativePath)
    ) {
      throw new Error(
        `Component path escapes the components directory: ${componentPath}`,
      );
    }

    return componentPath;
  }

  private async readComponent(
    componentName: string,
    componentPath: string,
  ): Promise<string> {
    try {
      return await readFile(componentPath, "utf8");
    } catch (error) {
      throw new Error(
        `Failed to load x-component "${componentName}": ${componentPath}`,
        { cause: error },
      );
    }
  }
}
