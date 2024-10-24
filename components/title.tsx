function Tittle({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="text-lg md:text-2xl text-slate-800 dark:text-slate-200 font-semibold w-full">
      {children}
    </h1>
  );
}

export default Tittle;
