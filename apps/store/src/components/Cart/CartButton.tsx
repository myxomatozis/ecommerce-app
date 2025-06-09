import { Button, toast } from "@thefolk/ui";
import { FC } from "react";
import { Link } from "react-router-dom";

const CartButton: FC = () => (
  <Button
    variant="primary"
    to="/cart"
    as={Link}
    size="sm"
    aria-label="Open Cart"
  >
    View Cart
  </Button>
);

export default CartButton;

export const successAddToCartMessage = ({
  productName,
}: {
  productName: string;
}) =>
  toast.success(
    <div className="flex items-center justify-between w-full">
      <span className="flex-1 pr-4">
        <strong className="font-medium">{productName}</strong> added to cart
      </span>
      <CartButton />
    </div>,
    undefined,
    {
      duration: 4000,
    }
  );
