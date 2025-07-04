import { useForm, Controller } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../../redux/auth/userSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.user);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

const onSubmit = async (data) => {
  try {
    const phoneNumber = data.phone;
    const res = await dispatch(forgotPassword(phoneNumber)).unwrap();
    console.log(res);
    if (res?.success) {
      toast.success("OTP sent successfully");
      navigate("/reset-password");
    } else {
      toast.error(res?.message || "Something went wrong");
    }
  } catch (error) {
    toast.error(error?.message || "Failed to send OTP");
  }
};


  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md p-6 rounded border bg-white shadow"
      >
        <h2 className="text-2xl prata-regular font-semibold mb-6 text-center">
          Forgot Password
        </h2>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Phone Number</label>
          <Controller
            control={control}
            name="phone"
            rules={{
              required: "Phone number is required",
              validate: (value) =>
                (value.startsWith("91") && value.length === 12) ||
                "Only +91 format is supported",
            }}
            render={({ field }) => (
              <PhoneInput
                {...field}
                country={"in"}
                onlyCountries={["in"]}
                countryCodeEditable={false}
                enableSearch={false}
                inputClass="!w-full !border !border-gray-300 !py-2 !px-10 !text-sm"
                placeholder="Enter phone number"
              />
            )}
          />
          {errors.phone && (
            <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black cursor-pointer text-white py-2 rounded  transition"
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
