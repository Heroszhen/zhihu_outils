export function readFile(file: File, needText: boolean = false): Promise<string | null> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const result = e.target?.result;
      resolve(typeof result === "string" ? result : null);
    };
    if (needText) reader.readAsText(file, "UTF-8");
    else reader.readAsDataURL(file);
  });
}
