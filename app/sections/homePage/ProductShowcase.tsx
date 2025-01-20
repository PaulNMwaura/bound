import productImage from "@/app/assets/ui-pictures/product.jpg";
import Image from "next/image";

export default function ProductShowcase() {
  return (
    <section className="bg-gradient-to-b from-[#FFFFFF] to-purple py-24">
      <div className="container">
        <div className="max-w-[540px] mx-auto">
          <div className="flex justify-center">
            <div className="tag">MAKING IT EASIER TO</div>
          </div>
          <h2 className="section-title mt-5 ">
            Streamline and expand
          </h2>
          <p className="section-description mt-5">
            Easily find, message, and book a profesional in your area for the
            services your require.
          </p>
          <Image src={productImage} alt="Product Image" className="mt-10 outline outline-1 outline-black rounded-md shadow-lg" />
        </div>
      </div>
    </section>
  );
};
