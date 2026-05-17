"use client";

<<<<<<< HEAD
import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
type FieldValues = Record<string, unknown>;
type FieldPath<TFieldValues extends FieldValues> = Extract<
  keyof TFieldValues,
  string
>;
type ControllerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
  render?: (props: {
    field: { name: TName };
    fieldState: Record<string, unknown>;
    formState: Record<string, unknown>;
  }) => React.ReactElement | null;
};
=======
import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
>>>>>>> main

const FormProvider = ({
  children,
  ...formState
}: React.PropsWithChildren<Record<string, unknown>>) => (
  <FormRuntimeContext.Provider
    value={{
      formState,
      getFieldState: () => ({}),
    }}
  >
    {children}
  </FormRuntimeContext.Provider>
);

<<<<<<< HEAD
const Controller = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  render,
}: ControllerProps<TFieldValues, TName>) =>
  render?.({ field: { name }, fieldState: {}, formState: {} }) ?? null;

const FormRuntimeContext = React.createContext({
  formState: {} as Record<string, unknown>,
  getFieldState: (_name: string, _formState: Record<string, unknown>) =>
    ({}) as { error?: { message?: string } },
});

const useFormContext = () => React.useContext(FormRuntimeContext);

const Form = FormProvider;
=======
type FieldValues = Record<string, unknown>
type FieldPath<TFieldValues extends FieldValues> = Extract<keyof TFieldValues, string>

type ControllerRenderProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
> = {
  field: {
    name: TName
    value: TFieldValues[TName] | ""
    onChange: (value: unknown) => void
    onBlur: () => void
    ref: React.Ref<unknown>
  }
  fieldState: {
    error?: {
      message?: string
    }
  }
}

type ControllerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName
  render?: (props: ControllerRenderProps<TFieldValues, TName>) => React.ReactNode
}

const Form = ({ children }: { children: React.ReactNode }) => <>{children}</>
>>>>>>> main

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue,
);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  render,
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name }}>
      {render?.({
        field: {
          name,
          value: "",
          onChange: () => undefined,
          onBlur: () => undefined,
          ref: null,
        },
        fieldState: {},
      })}
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
<<<<<<< HEAD
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
=======
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)

  if (!fieldContext.name) {
    throw new Error("useFormField should be used within <FormField>")
>>>>>>> main
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
<<<<<<< HEAD
    ...fieldState,
  };
};
=======
    error: undefined as { message?: string } | undefined,
  }
}
>>>>>>> main

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue,
);

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  );
});
FormItem.displayName = "FormItem";

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();

  return (
    <Label
      ref={ref}
      className={cn(error && "text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  );
});
FormLabel.displayName = "FormLabel";

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  );
});
FormControl.displayName = "FormControl";

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
});
FormDescription.displayName = "FormDescription";

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message ?? "") : children;

  if (!body) {
    return null;
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  );
});
FormMessage.displayName = "FormMessage";

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
};
