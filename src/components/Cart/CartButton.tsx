import { toast } from "@/utils/toast";
import { Button } from "../UI";
import { FC } from "react";
import { Link } from "react-router-dom";

const CartButton: FC = () => (
  <Button variant="primary" to="/cart" as={Link} aria-label="Open Cart">
    Go to Cart
  </Button>
);

export default CartButton;

export const successAddToCartMessage = ({
  productName,
}: {
  productName: string;
}) =>
  toast.success(
    <div className="flex items center space-x-2">
      {productName}has been added to your cart!
      <div className="ml-auto min-w-max">
        <CartButton />
      </div>
    </div>
  );
