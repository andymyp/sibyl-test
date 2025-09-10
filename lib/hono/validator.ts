/* eslint-disable @typescript-eslint/no-explicit-any */
export function formatZodError(error: any) {
  try {
    const details = JSON.parse(error.message);

    return details.map((e: any) => {
      const field = e.path.join(".");

      switch (e.code) {
        case "too_small":
          if (e.type === "string") {
            return {
              field,
              message: `${capitalize(field)} must be at least ${
                e.minimum
              } characters long.`,
            };
          }
          if (e.type === "array") {
            return {
              field,
              message: `${capitalize(field)} must contain at least ${
                e.minimum
              } items.`,
            };
          }
          break;

        case "too_big":
          if (e.type === "string") {
            return {
              field,
              message: `${capitalize(field)} must be at most ${
                e.maximum
              } characters long.`,
            };
          }
          if (e.type === "array") {
            return {
              field,
              message: `${capitalize(field)} must contain at most ${
                e.maximum
              } items.`,
            };
          }
          break;

        case "invalid_type":
          return {
            field,
            message: `${capitalize(field)} must be a ${e.expected}.`,
          };

        case "invalid_enum_value":
          return {
            field,
            message: `${capitalize(field)} must be one of: ${e.options.join(
              ", "
            )}.`,
          };

        default:
          return {
            field,
            message: e.message || `${capitalize(field)} is invalid.`,
          };
      }
    });
  } catch {
    return [{ message: "Validation failed." }];
  }
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
