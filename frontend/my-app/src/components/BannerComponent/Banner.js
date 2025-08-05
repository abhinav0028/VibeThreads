import React from 'react'; 
import './Banner.css';
import 'bootstrap/dist/css/bootstrap.min.css'


function Banner() {
    return (
        <>
        
        <div id="banner">
          <div class="container-fluid p-0">
    <div id="header-carousel" class="carousel slide carousel-fade" data-bs-ride="carousel">
        <div class="carousel-inner">
            <div class="carousel-item active">
                <img src="./assets/images/try_banner.webp" class="d-block w-100" alt="image"/>
                <div class="carousel-caption d-flex flex-column align-items-center justify-content-center" >
                    <div class="p-3" style={{maxWidth: "900px"}}>
                        
                       
                    </div>
                </div>
            </div>
            
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#header-carousel"
            data-bs-slide="prev">
           
          
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#header-carousel"
            data-bs-slide="next">
            
           
        </button>
    </div>
  </div> 
  </div>
        </>
    );
}

export default Banner;