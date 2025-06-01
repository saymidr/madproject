import "./App.css";
import React, { useEffect, useReducer, createContext, useContext } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// Redux-like setup
const initialState = {
  products: [],
  searchQuery: "",
};

const AppContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_PRODUCTS":
      return { ...state, products: action.payload };
    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload };
    default:
      return state;
  }
};

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

const useApp = () => useContext(AppContext);

// Components
const Header = () => {
  const { state, dispatch } = useApp();
  return (
    <header className="header">
      <h1 className="title">Ahmed Store</h1>
      <input
        type="text"
        placeholder="Search Products..."
        className="search"
        value={state.searchQuery}
        onChange={(e) => dispatch({ type: "SET_SEARCH_QUERY", payload: e.target.value })}
      />
      <div className="nav-buttons">
        <Link to="/"><button>Home</button></Link>
        <Link to="/about"><button>About Us</button></Link>
        <Link to="/contact"><button>Contact</button></Link>
      </div>
    </header>
  );
};

const ProductList = () => {
  const { state } = useApp();
  const filtered = state.products.filter((item) =>
    item.Name.toLowerCase().includes(state.searchQuery.toLowerCase())
  );

  return (
    <div className="product-list">
      {filtered.map((product, index) => (
        <div className="product-card" key={index}>
          <a href={product.Link} target="_blank" rel="noopener noreferrer">
            <img className="product-image" src={product.Image} alt={product.Name} />
          </a>
          <h3 className="product-name">{product.Name}</h3>
          <p className="product-price">Rs {product.Price}</p>
        </div>
      ))}
    </div>
  );
};

const Footer = () => (
  <footer className="footer">
    <p>© 2025 Ahmed Store. All rights reserved.</p>
  </footer>
);

const Home = () => {
  const { dispatch } = useApp();

  useEffect(() => {
    const getData = async () => {
      const res = await axios.get(
        "https://api.sheetbest.com/sheets/87274f2d-4965-4247-8087-e08ad0725526"
      );
      dispatch({ type: "SET_PRODUCTS", payload: res.data });
    };
    getData();
  }, [dispatch]);

  return (
    <>
      <p className="marketing">Quality products for you — every day, every deal!</p>
      <ProductList />
    </>
  );
};

const About = () => <div className="main-content"><h2>About Us</h2><p>We are here to serve you.</p></div>;
const Contact = () => <div className="main-content"><h2>Contact Us</h2><p>Reach us at contact@ahmedstore.com</p></div>;

const App = () => (
  <AppProvider>
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Footer />
    </Router>
  </AppProvider>
);

export default App;
