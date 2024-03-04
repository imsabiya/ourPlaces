const NotFound = () => {
  return (
    <div className="flex flex-col justify-start place-items-center mt-16">
      <h2 className="font-bold text-xl">
        404: The page you are looking for isn’t here.{" "}
      </h2>
      <br />
      <div>
        You either tried some shady route or you came here by mistake. Whichever
        it is, try using the navigation.
      </div>
    </div>
  );
};

export default NotFound;
