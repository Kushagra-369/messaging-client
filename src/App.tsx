import Navbar from "./Components/Navbar/Navbar";

export default function App() {
  return (
    <div>
      <div
        className="fixed inset-0 -z-10 w-full h-full
        [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#7ee0ff_100%)]
        dark:[background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"
      />
      <Navbar />
    </div>
  );
}
