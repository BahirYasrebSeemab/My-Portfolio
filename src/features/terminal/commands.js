import { filesystem } from "./filesystem.js";

const COMMANDS = [
  { name: "ls [path]", desc: "list what's in a folder" },
  { name: "cd <path>", desc: "move around — landing on one of my real sections takes you there" },
  { name: "cat <file>", desc: "print a file's contents" },
  { name: "pwd", desc: "print the current path" },
  { name: "clear", desc: "clear the screen" },
  { name: "whoami", desc: "guess" },
  { name: "help / --help", desc: "show this list" },
];

function getNodeAt(segments) {
  let node = filesystem;
  for (const segment of segments) {
    if (!node.children || !node.children[segment]) return null;
    node = node.children[segment];
  }
  return node;
}

function resolvePath(cwd, inputPath) {
  const isAbsolute = inputPath.startsWith("~") || inputPath.startsWith("/");
  const raw = inputPath.replace(/^~\/?/, "").replace(/^\/+/, "");
  const parts = raw.split("/").filter(Boolean);

  const segments = isAbsolute ? [] : [...cwd];
  for (const part of parts) {
    if (part === ".") continue;
    else if (part === "..") {
      if (segments.length) segments.pop();
    } else {
      segments.push(part);
    }
  }

  const node = getNodeAt(segments);
  if (!node) return null;
  return { segments, node };
}

export function formatPath(segments) {
  return segments.length ? `~/${segments.join("/")}` : "~";
}

export function runCommand(input, { cwd, setCwd }) {
  const command = input.trim();
  if (!command) return { output: [] };

  const [name, ...args] = command.split(/\s+/);

  switch (name) {
    case "help":
    case "--help":
      return {
        output: [
          "things you can do here (mostly for getting around my profile):",
          ...COMMANDS.map((c) => `  ${c.name.padEnd(16)} ${c.desc}`),
        ],
      };

    case "pwd":
      return { output: [formatPath(cwd)] };

    case "clear":
      return { clear: true };

    case "whoami":
      return { output: ["guest — currently poking around bahir's portfolio"] };

    case "ls": {
      const target = resolvePath(cwd, args[0] || "");
      if (!target || target.node.type !== "dir") {
        return { output: [`ls: cannot access '${args[0]}': no such directory`], error: true };
      }
      const entries = Object.entries(target.node.children || {}).map(([entryName, node]) =>
        node.type === "dir" ? `${entryName}/` : entryName,
      );
      return { output: entries.length ? entries : ["(empty)"] };
    }

    case "cd": {
      const path = args[0] || "~";
      const target = resolvePath(cwd, path);
      if (!target || target.node.type !== "dir") {
        return { output: [`cd: no such directory: ${args[0]}`], error: true };
      }
      // ".." should only ever move you up — it should never surprise-navigate
      // you off the terminal just because it lands on a real section's folder.
      const isParentTraversal = path.split("/").includes("..");
      if (target.node.navigateTo && !isParentTraversal) {
        return {
          output: [`switching to ${target.node.navigateTo}...`],
          navigateAfter: target.node.navigateTo,
        };
      }
      setCwd(target.segments);
      return { output: [] };
    }

    case "cat": {
      if (!args[0]) return { output: ["cat: missing file operand"], error: true };
      const target = resolvePath(cwd, args[0]);
      if (!target || target.node.type !== "file") {
        return { output: [`cat: ${args[0]}: no such file`], error: true };
      }
      return {
        output: target.node.content.split("\n"),
        isCode: args[0].endsWith(".js"),
      };
    }

    default:
      return { output: [`command not found: ${name} — try 'help'`], error: true };
  }
}
