import { useState } from "react";
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Stack,
  LoadingOverlay,
  Group,
  Anchor,
  rem,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { RiLockLine, RiLoginBoxLine, RiMailLine } from "react-icons/ri";
import { API_URL } from "../../utils/Constant";
import axios from "axios";
import Cookies from "js-cookie";

const Login = () => {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      email: "johndoe@example.com",
      password: "securepassword",
    },
    validate: {
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : "Invalid email address",
      password: (value) =>
        value.length >= 6 ? null : "Password must be at least 6 characters",
    },
  });

  const handleSubmit = async (values) => {
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/teachers/login`, values);
      const { message, token } = response.data;

      // Save token using js-cookie
      Cookies.set("token", token, { expires: 7 });

      notifications.show({
        title: "Login Successful",
        message: message,
        color: "green",
      });
      window.location.href = "/";
    } catch (error) {
      notifications.show({
        title: "Login Failed",
        message: error.response?.data?.message || "An error occurred",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative  flex items-center justify-center p-4">
      <div className="svgp1 w-full h-dvh absolute top-0 left-0 -z-10 opacity-5"></div>
      <Paper
        radius="md"
        p="xl"
        withBorder
        shadow="xl"
        className="w-full max-w-md shadow-xl"
      >
        <LoadingOverlay visible={loading} overlayBlur={2} />

        <div className="flex flex-col items-center mb-6">
          {/* todo : image change  */}
          <img
            src="https://vsbm.odishavikash.com/assets/img/VSBM.png"
            alt="Logo"
            className="size-[125px] object-contain object-center mb-4"
          />
          <Title
            order={2}
            fw={600}
            className="text-center font-bold text-gray-800"
          >
            Admin Dashboard
          </Title>
          <Title
            order={4}
            fw={400}
            mt={6}
            className="text-center  text-gray-600 font-normal mt-2"
          >
            Login
          </Title>
        </div>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              required
              label="Email Address"
              placeholder="admin@school.edu"
              size="md"
              icon={<RiMailLine size={16} />}
              {...form.getInputProps("email")}
              classNames={{
                label: "text-gray-400 !text-xs mb-2 font-medium",
              }}
            />

            <PasswordInput
              required
              label="Password"
              placeholder="Your password"
              size="md"
              icon={<RiLockLine size={16} />}
              {...form.getInputProps("password")}
              classNames={{
                label: "text-gray-400 !text-xs mb-2 font-medium",
              }}
            />
            <Button
              rightSection={<RiLoginBoxLine />}
              type="submit"
              fullWidth
              mt={4}
              size="md"
            >
              Sign In
            </Button>
          </Stack>
        </form>
      </Paper>
    </div>
  );
};

export default Login;
