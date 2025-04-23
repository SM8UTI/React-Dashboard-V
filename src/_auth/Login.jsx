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

const Login = () => {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : "Invalid email address",
      password: (value) =>
        value.length >= 6 ? null : "Password must be at least 6 characters",
    },
  });

  const handleSubmit = (values) => {
    setLoading(true);

    // Simulate API call - replace with your actual API call
    setTimeout(() => {
      setLoading(false);
      notifications.show({
        title: "Login Successful",
        message: "Welcome to the admin dashboard!",
        color: "green",
      });
      console.log(values);
    }, 1500);
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
            src="https://placehold.co/400"
            alt="Logo"
            className="size-[60px] object-contain object-center mb-4"
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

        <div className="mt-6 text-center text-sm text-gray-500">
          By signing in, you agree to abide by our
          <Anchor href="#" size="sm" className="ml-1">
            Terms and Conditions
          </Anchor>
        </div>
      </Paper>
    </div>
  );
};

export default Login;
