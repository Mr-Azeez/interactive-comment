import { Avatar, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
type CommentFormProps = {
  placeholder: string;
  ButtonLabel: string;
  onSubmit: () => void;
  initialValue: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

const CommentForm: React.FC<CommentFormProps> = ({
  placeholder,
  ButtonLabel,
  onSubmit,
  initialValue,
  onChange
}) => {

  return (
    <div className="md:flex md:flex-row grid grid-cols-2 gap-3 md:w-[550px] w-[90%] md:h-[140px] bg-[#fff] px-4 py-4 rounded-md">
      <Textarea
        placeholder={placeholder}
        className="flex-1 w-full md:h-[100px] border rounded-lg p-2 resize-none md:order-1 col-span-2"
        value={initialValue}
        onChange={onChange}
      />
      <Avatar className="size-[40px] flex items-center justify-between md:order-0">
        <AvatarImage
          src="images/avatars/image-juliusomo.png"
          alt="user image"
        />
      </Avatar>

      <Button
        className="uppercase cursor-pointer bg-[#5457b6] hover:bg-[#c3c4ef] md:px-6 h-[40px] w-[90px] md:order-2"
        onClick={onSubmit}
      >
        {ButtonLabel}
      </Button>
    </div>
  );
};

export default CommentForm;
