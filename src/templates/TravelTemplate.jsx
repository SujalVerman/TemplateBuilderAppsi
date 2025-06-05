export default function TravelTemplate({ onSelect, styles }) {
  return (
    <div className="p-10">
      <h1
        onClick={() => onSelect("title")}
        style={styles["title"]}
        className="text-4xl font-bold mb-4 cursor-pointer"
      >
        🌍 Explore the World
      </h1>
      <p
        onClick={() => onSelect("desc")}
        style={styles["desc"]}
        className="text-lg text-gray-600 cursor-pointer"
      >
        Start your next adventure from the comfort of your browser.
      </p>
      <button
        onClick={() => onSelect("cta")}
        style={styles["cta"]}
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded cursor-pointer"
      >
        Get Started
      </button>
    </div>
  );
}
