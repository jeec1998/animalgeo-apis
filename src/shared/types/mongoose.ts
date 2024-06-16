export type MongooseQueryOptions = {
  select?: string;
  populate?: string[] | PopulateOptions[];
  aggregate?: AggregateOptions[];
};

type PopulateOptions = {
  path: string;
  select?: string;
};

type AggregateOptions = {
  $lookup: {
    from: string;
    localField: string;
    as: string;
  };
};
