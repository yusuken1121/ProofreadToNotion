export const descriptionTypeOptions = {
  grammar: "文法",
  vocabulary: "語彙",
} as const;

export const descriptionTypeKeys = Object.keys(
  descriptionTypeOptions
) as (keyof typeof descriptionTypeOptions)[];
