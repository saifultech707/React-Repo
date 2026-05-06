import "./ProductCard.css"; // CSS ফাইলটি ইম্পোর্ট করা হলো
import showimage from "./assets/IMG_20260206_154654.jpg";

export default function ProductCard() {
  return (
    <div className="product-container">
      <div className="card">
        {/* জুতোর ছবি */}
        <div className="imgBx">
          <img src={showimage} alt="Nike Shoe" />
        </div>

        {/* জুতোর ডিটেইলস */}
        <div className="contentBx">
          <h2>Nike Shoes</h2>

          <div className="size">
            <h3>Size :</h3>
            <span>7</span>
            <span>8</span>
            <span>9</span>
            <span>10</span>
          </div>

          <div className="color">
            <h3>Color :</h3>
            <span></span>
            <span></span>
            <span></span>
          </div>

          <a href="#">Buy Now</a>
        </div>
      </div>
    </div>
  );
}
