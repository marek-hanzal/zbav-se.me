import os
import re

src_dir = "/Users/marekhanzal/Project/marek-hanzal/zbav-se.me/apps/app/src"
test_dir = "/Users/marekhanzal/Project/marek-hanzal/zbav-se.me/apps/app/test"

# Symbols that were wrongly put under @/lib/client/container
WRONG_PATH = "@/lib/client/container"
symbol_to_correct_path = {
    "SpinnerContainer": "@/lib/client/spinner",
    "LabelValue": "@/lib/client/value",
    "ValueList": "@/lib/client/value",
}

# Revert mappings
REVERT_MAP = {
    "@/lib/client/utils": "@use-pico/client/utils",
    "@/lib/client/link-to": "@use-pico/client/ui/link-to",
    "@/lib/client/fade": "@use-pico/client/ui/fade",
}

files_changed = 0


def add_symbol_to_import(content, symbol, target_path):
    """Add a symbol to an existing import from target_path, or create a new one."""
    # Check if target_path already has an import
    pattern = rf'(import\s+\{{)([^}}]+)(\}}\s+from\s+"{re.escape(target_path)}"\s*;)'
    match = re.search(pattern, content)
    if match:
        # Add symbol to existing import
        existing = match.group(2).strip().rstrip(",")
        new_import = f"{match.group(1)} {symbol}, {existing} {match.group(3)}"
        content = content[: match.start()] + new_import + content[match.end() :]
    else:
        # Add new import line at the top (after any existing first import)
        new_line = f'import {{ {symbol} }} from "{target_path}";\n'
        # Insert after the first import line
        first_import = re.search(r"^import\s", content, re.MULTILINE)
        if first_import:
            # Find end of first import line
            end_of_line = content.index("\n", first_import.start()) + 1
            content = content[:end_of_line] + new_line + content[end_of_line:]
        else:
            content = new_line + content
    return content


def remove_symbol_from_import(content, symbol, source_path):
    """Remove a symbol from an import statement. Clean up if empty."""
    # Find the import line
    pattern = rf'^(import\s+\{{)([^}}]*)(\}}\s+from\s+"{re.escape(source_path)}"\s*;)'
    match = re.search(pattern, content, re.MULTILINE)
    if not match:
        return content

    imports_str = match.group(2)
    # Parse individual imports
    symbols = [s.strip().rstrip(",") for s in imports_str.split(",") if s.strip()]
    symbols = [s for s in symbols if s != symbol]

    if not symbols:
        # Remove the entire import line
        content = content[: match.start()] + content[match.end() :]
        # Remove leading newline if present
        if content.startswith("\n"):
            content = content[1:]
    else:
        # Rebuild import
        new_imports = ", ".join(symbols)
        new_line = f'import {{ {new_imports} }} from "{source_path}";'
        content = content[: match.start()] + new_line + content[match.end() :]

    return content


for root_dir in [src_dir, test_dir]:
    if not os.path.isdir(root_dir):
        continue
    for root, dirs, files in os.walk(root_dir):
        for fname in files:
            if not fname.endswith((".ts", ".tsx")):
                continue
            fpath = os.path.join(root, fname)
            with open(fpath, "r") as f:
                content = f.read()

            original = content

            # Fix 1: Wrong path imports (SpinnerContainer, LabelValue, ValueList from container)
            for symbol, correct_path in symbol_to_correct_path.items():
                # Check if file imports this symbol from the wrong path
                if f'from "{WRONG_PATH}"' not in content:
                    continue
                if symbol not in content:
                    continue

                # Check that symbol is actually imported from the wrong path (not just used)
                import_pattern = rf'import\s+\{{[^}}]*{re.escape(symbol)}[^}}]*\}}\s+from\s+"{re.escape(WRONG_PATH)}"'
                if not re.search(import_pattern, content):
                    continue

                # Remove from wrong import
                content = remove_symbol_from_import(content, symbol, WRONG_PATH)
                # Add to correct import
                content = add_symbol_to_import(content, symbol, correct_path)

            # Fix 2: Revert imports
            for wrong_path, correct_path in REVERT_MAP.items():
                if f'from "{wrong_path}"' in content:
                    content = content.replace(
                        f'from "{wrong_path}"', f'from "{correct_path}"'
                    )

            if content != original:
                with open(fpath, "w") as f:
                    f.write(content)
                files_changed += 1

print(f"Files changed: {files_changed}")
