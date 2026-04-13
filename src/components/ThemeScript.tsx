export function ThemeScript() {
  const script = `
  (function () {
    try {
      var theme = localStorage.getItem("theme");
      if (theme !== "dark" && theme !== "light") theme = "light";
      document.documentElement.dataset.theme = theme;
    } catch (e) {}
  })();
  `;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}

