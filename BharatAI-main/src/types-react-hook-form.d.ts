declare module "react-hook-form" {
  import * as React from "react";

  export type FieldValues = Record<string, unknown>;
  export type FieldPath<TFieldValues extends FieldValues> = Extract<
    keyof TFieldValues,
    string
  >;

  export type ControllerProps<
    TFieldValues extends FieldValues,
    TName extends FieldPath<TFieldValues>,
  > = {
    name: TName;
    render?: (props: unknown) => React.ReactNode;
  } & Record<string, unknown>;

  export const Controller: <
    TFieldValues extends FieldValues,
    TName extends FieldPath<TFieldValues>,
  >(
    props: ControllerProps<TFieldValues, TName>,
  ) => React.ReactElement | null;

  export const FormProvider: React.ComponentType<React.PropsWithChildren>;

  export function useFormContext(): {
    getFieldState: (
      name: string,
      formState: unknown,
    ) => { error?: { message?: React.ReactNode } };
    formState: unknown;
  };
}
