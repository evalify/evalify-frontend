import Image from "next/image";

export default function page() {
  return (
    <div className="container mx-auto py-10 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Evalify Image Page
      </h1>
      <p className="text-center text-gray-600">
        <Image
          src="/blob/garbage.jpg"
          alt="garbage img"
          width={500}
          height={300}
        />
        This is a placeholder for the image page.
      </p>
    </div>
  );
}
