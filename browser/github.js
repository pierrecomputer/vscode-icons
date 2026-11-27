(() => {
  const theme = pierreCompleteTheme;
  const iconAttribute = "data-pierre-file-icon";
  const nativeIcons = [
    ".octicon-file",
    ".octicon-file-directory",
    ".octicon-file-directory-fill",
    ".octicon-file-directory-open",
    ".octicon-file-directory-open-fill",
    ".octicon-file-symlink-file",
    ".octicon-file-symlink-directory",
  ].join(", ");
  // Each GitHub file view has its own selectors: row identifies the file or folder row,
  // name finds its label, and visual points to the icon container (:scope means the row itself).
  const surfaces = [
    {
      row: ".react-directory-filename-column",
      name: ".react-directory-filename-cell a",
      visual: ":scope",
    },
    {
      row: ".PRIVATE_TreeView-item-content",
      name: ".PRIVATE_TreeView-item-content-text",
      visual: ".PRIVATE_TreeView-item-visual",
    },
    {
      row: '[data-tree-entry-type="root"] :is([data-tree-entry-type="file"], [data-tree-entry-type="directory"])',
      name: ":scope > .ActionList-content .ActionList-item-label",
      visual: ":scope > .ActionList-content .ActionList-item-visual--leading",
    },
  ];
  const rowSelector = surfaces.map(({ row }) => row).join(", ");
  const caseInsensitiveMap = (entries) =>
    new Map(Object.entries(entries ?? {}).map(([name, icon]) => [name.toLowerCase(), icon]));
  const fileNames = caseInsensitiveMap(theme.fileNames);
  const extensions = caseInsensitiveMap(theme.fileExtensions);
  const folderNames = caseInsensitiveMap(theme.folderNames);
  const expandedFolderNames = caseInsensitiveMap(theme.folderNamesExpanded);

  function fileIcon(name) {
    const exact = fileNames.get(name);
    if (exact) return exact;

    // Try compound suffixes before their shorter forms, including dotfiles.
    for (let dot = name.indexOf("."); dot !== -1; dot = name.indexOf(".", dot + 1)) {
      const icon = extensions.get(name.slice(dot + 1));
      if (icon) return icon;
    }

    return extensions.get(name) ?? theme.file;
  }

  function updateRow(row) {
    const surface = surfaces.find(({ row: selector }) => row.matches(selector));
    if (!surface) return;

    const label = row.querySelector(surface.name);
    const visual = surface.visual === ":scope" ? row : row.querySelector(surface.visual);
    if (!visual) return;

    const icon = visual.querySelector(`svg:is(${nativeIcons})`);
    const previous = visual.querySelector(`[${iconAttribute}]`);
    const text = (label?.getAttribute("title") || label?.textContent)?.trim();
    if (previous && (previous !== icon || !text)) previous.removeAttribute(iconAttribute);
    if (!icon || !text) return;

    const name = text.split("/").pop().toLowerCase();
    const expanded =
      row.closest('[role="treeitem"]')?.getAttribute("aria-expanded") === "true" ||
      label.closest("[aria-expanded]")?.getAttribute("aria-expanded") === "true" ||
      icon.matches(".octicon-file-directory-open, .octicon-file-directory-open-fill");

    let replacement;
    if (icon.matches(".octicon-file-symlink-file") && theme.fileSymlink) {
      replacement = theme.fileSymlink;
    } else if (icon.matches(".octicon-file")) {
      replacement = fileIcon(name);
    } else if (expanded) {
      replacement = expandedFolderNames.get(name) ?? theme.folderExpanded;
    } else {
      replacement = folderNames.get(name) ?? theme.folder;
    }

    if (icon.getAttribute(iconAttribute) !== replacement) {
      icon.setAttribute(iconAttribute, replacement);
    }
  }

  const pendingRows = new Set(document.querySelectorAll(rowSelector));
  let frame = null;

  function collectRows(node) {
    if (node instanceof Element || node instanceof DocumentFragment) {
      node.querySelectorAll(rowSelector).forEach((row) => pendingRows.add(row));
    }
  }

  function flushRows() {
    frame = null;
    for (const row of pendingRows) {
      if (row.isConnected) updateRow(row);
    }
    pendingRows.clear();
  }

  new MutationObserver((mutations) => {
    for (const { target, addedNodes, attributeName } of mutations) {
      const element = target instanceof Element ? target : target.parentElement;
      const row = element?.closest(rowSelector);
      if (row) pendingRows.add(row);
      if (attributeName === "aria-expanded" && !row) collectRows(element);

      for (const node of addedNodes) {
        if (node instanceof Element && node.matches(rowSelector)) pendingRows.add(node);
        collectRows(node);
      }
    }
    if (pendingRows.size && frame === null) frame = requestAnimationFrame(flushRows);
  }).observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: ["aria-expanded", "class", "title"],
  });

  flushRows();
})();
