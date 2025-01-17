import { BrowserRouter, Routes, Route } from "react-router-dom";
import Arena from "./components/gameplay/Arena";
import HomePage from "./components/home/HomePage";
import Home from "./components/home/Home";
import Tutorial from "./components/tutorial/Tutorial";
import Rooms from "./components/room/Rooms";
import Navbar from "./components/navbar/Navbar";
import PageNotFound from "./PageNotFound";
import CustomToaster from "./components/misc/CustomToaster";
import Footer from "./components/footer/Footer";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        
        <Routes>
          <Route path="/" element={<HomePage />}>
            <Route index element={<Home />} />
            <Route path="/tutorial" element={<Tutorial />} />
            <Route path="/rooms" element={<Rooms />} />
          </Route>

          <Route path="/arena" element={<Arena />}>
            <Route path="/arena/:roomId" element={<Arena />}/>
          </Route>

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>

      <CustomToaster />

      <Footer />
    </>
  )
}

export default App;