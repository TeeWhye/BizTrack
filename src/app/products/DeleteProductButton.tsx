import { deleteProduct } from "@/app/products/actions/actions";

type DeleteProductButtonProps = {
  productId: string;
};

export default function DeleteProductButton({
  productId,
}: DeleteProductButtonProps) {
  return (
    <form action={deleteProduct}>
      <input
        type="hidden"
        name="id"
        value={productId}
      />

      <button
        type="submit"
        className="text-sm font-medium text-red-600 hover:text-red-800"
      >
        Delete
      </button>
    </form>
  );
}