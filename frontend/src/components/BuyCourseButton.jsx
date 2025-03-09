import { Button } from "./ui/button";
import { useCreateCheckoutSessionMutation } from "../features/api/purchaseApi";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";
const BuyCourseButton = ({ courseId }) => {
  const [
    createCheckoutSession,
    { data, isLoading, isSuccess, isError, error },
  ] = useCreateCheckoutSessionMutation();
  const purchaseCourseHandler = async () => {
    await createCheckoutSession(courseId);
  };

  useEffect(() => {
    if (isSuccess) {
      if (data?.url) {
        window.location.href = data.url;
      } else {
        toast.error("Invalud response from server.");
      }
    }
    if (isError) {
      toast.error(error?.data?.message || "Failed to create checkout Session");
    }
  }, [data, isError, isSuccess, error]);
  return (
    <Button
      disabled={isLoading}
      onClick={purchaseCourseHandler}
      clasName="w-full"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        </>
      ) : (
        "Purchase Course"
      )}
    </Button>
  );
};

export default BuyCourseButton;
