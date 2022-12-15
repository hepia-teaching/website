import { z } from "zod";

export function useForm<T extends z.ZodObject<z.ZodRawShape>>({
  schema,
  initialValues,
}: {
  schema: T;
  initialValues: Partial<z.infer<T>> | undefined;
}): {
  values: z.infer<T>;
  errors: Partial<{ [key in keyof z.infer<T>]: any }>;
  handleSubmit: (cb: (values: z.infer<T>) => void) => () => void;
} {
  const shape = Object.keys(schema.shape).reduce(
    (previous, current) => ({
      ...previous,
      [current]: initialValues?.[current] || undefined,
    }),
    {}
  );

  const values = reactive(shape);
  const errors = reactive({});

  const handleSubmit: (cb: (values: z.infer<T>) => void) => () => void = (
    cb
  ) => {
    return () => {
      const result = schema.safeParse(values);

      if (result.success) {
        cb(result.data);
      } else {
        console.error(result);
      }
    };
  };

  return {
    values,
    errors,
    handleSubmit,
  };
}
