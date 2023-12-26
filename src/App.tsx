const App = () => {
  return (
    <div>
      <div>PARKYODO's Blog</div>
      <img src="favicon.ico" alt="" />
      <img src="assets/test.png" alt="" />
      <div>{process.env.REACT_APP_ENV}</div>
    </div>
  );
};

export default App;
