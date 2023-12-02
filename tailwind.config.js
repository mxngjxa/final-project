module.exports = {
  content: ["./src/**/*.tsx", "./src/**/*.css"],
  plugins: [require("@tailwindcss/forms")],
  theme: {
    extend: {
      backgroundColor: {
        "sky-blue": "#87CEEB",
        "light-spring-green": "#00FA9A",
        "pastel-light-green": "#C8FFB0",
      },
      textColor: {
        "gray-600": "#4B5563", // Adjusted gray
        "indigo-700": "#5A67D8", // Adjusted indigo
        "green-600": "#38A169", // Adjusted green
        "blue-600": "#3B82F6", // Adjusted blue
      },
    },
  },
};
