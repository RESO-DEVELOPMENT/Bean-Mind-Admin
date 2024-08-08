import React, { useState } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Box, Card, CardActionArea, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { PATH_DASHBOARD } from 'routes/paths';
import { TMajor } from 'types/major';
import majorApi from 'apis/major';
import { useQuery } from 'react-query';

const GeneralApp = () => {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0); // Track active slide

  // Fetch majors data using majorApi (similar to previous examples)
  const { data: majorsData, isLoading, error } = useQuery(
    'majors',
    majorApi.getMajors // Make sure this returns the data in the correct structure
  );

  // Custom Arrows (for styling)
  const NextArrow = (props: any) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", right: '2rem', 
          background: 'lightgray', // Add a semi-transparent black background
          borderRadius: '50%',             // Make the arrows circular
          //padding: '10px',                  // Add padding for better visibility
        }}
        onClick={onClick}
      />
    );
  }

  const PrevArrow = (props: any) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", left: '2rem', zIndex: 1, 
          background: 'lightgray', // Add a semi-transparent black background
          borderRadius: '50%',             // Make the arrows circular
          //padding: '10px',                  // Add padding for better visibility
        }}
        onClick={onClick}
      />
    );
  }

  const settings = {
    dots: true, // Show navigation dots
    infinite: true, // Loop the slides
    speed: 500, // Transition speed in milliseconds
    slidesToShow: 1, // Number of slides to show at once
    slidesToScroll: 1, // Number of slides to scroll on click
    nextArrow: <NextArrow />, // Custom next arrow (defined below)
    prevArrow: <PrevArrow />, // Custom previous arrow (defined below)
    beforeChange: (current: number, next: number) => setActiveSlide(next), // Update active slide
    autoplay: true,             // Enable autoplay
    autoplaySpeed: 5000,        // Autoplay speed in milliseconds (3 seconds)
  };


  return (
    // ... your other JSX ...
    <>
      {/* // ... your other JSX ... */}
      <Box sx={{
        marginTop: '2rem', // Add top margin 
        position: 'relative', // To position arrows correctly
        maxWidth: '80vw', // Control the maximum width of the banner container 
        margin: '0 auto', // Center the banner container
      }}>
        <Slider {...settings}>
          {[1, 2, 3, 4, 5].map((slide) => (
            <div key={slide}>
              <BannerItem slide={slide} isActive={activeSlide === slide - 1} />
            </div>
          ))}
        </Slider>
      </Box>
      {/* // ... your other JSX ... */}
      <Box sx={{ marginTop: '4rem', textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Chương Trình Học
        </Typography>

        {isLoading ? ( // Loading state
          <Typography>Loading majors...</Typography>
        ) : error ? ( // Error state
          <Typography color="error">Error loading majors!</Typography>
        ) : ( // Data loaded successfully
          <Box sx={{
            position: 'relative', // Position arrows
            maxWidth: '90vw', // Adjust max width as needed
            // margin: '0 auto', // Center the section
            margin: '2rem auto', // Add margin top and bottom for spacing 
          }}>
            <Slider {...{
              ...settings,
              autoplay: false,
              slidesToShow: Math.min(3, majorsData?.data.items.length || 0), // Set slidesToShow based on item count
              // ... (other slider settings)
            }}>
              {majorsData?.data.items.map((major: TMajor) => (
                <div key={major.id}>
                  <MajorCard major={major} />
                </div>
              ))}
            </Slider>
          </Box>
        )}
      </Box></>
  );
};

// Banner Item Component
const BannerItem = ({ slide, isActive }: { slide: number, isActive: boolean }) => {
  return (
    <Box
      sx={{
        height: 200, // Adjust the height as needed
        borderRadius: 2, // Rounded corners
        backgroundColor: isActive ? 'lightgreen' : 'lightgray', // Example colors
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '1rem', // Add margin between slides
        overflow: 'hidden', // Hide content overflow for rounded corners
      }}
    >
      <Typography variant="h5">
        Banner {slide} - Random Text
      </Typography>
    </Box>
  );
};

// Major Card Component
const MajorCard = ({ major }: { major: TMajor }) => {
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        border: '1px solid #D9D9D9',
        backgroundColor: '#FFFFFF',
        borderRadius: 2,
        overflow: 'hidden',
        margin: '1rem',
        display: 'flex',
        flexDirection: 'column',
        height: 250, // Adjust card height if needed
      }}
    >
      <CardActionArea
        sx={{ height: '100%' }}
        onClick={() => navigate(`${PATH_DASHBOARD.courses.root}?curriculumId=${major.id}`)}
      >
        <Box
          sx={{
            position: 'relative', // Position relative for absolute positioning of overlay
            height: '100%', // Fill the entire box height
            backgroundImage: 'url(/assets/bg_blue_gradient.jpg)', // Set background image
            backgroundSize: 'cover', // Cover the entire area
            backgroundPosition: 'center', // Center the image
          }}
        >
          <Box
            sx={{
              position: 'absolute', // Position overlay over the background
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
              display: 'flex',
              alignItems: 'center', // Center title vertically
              justifyContent: 'center', // Center title horizontally
            }}
          >
            <Typography variant="h6" sx={{ fontFamily: 'Segoe UI', fontWeight: 'bold', color: 'white' }}>
              {major.title}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ padding: 2, flexGrow: 2 }}> {/* Description and other content */}
          {major.description} <br />
        </Box>
      </CardActionArea>
    </Card>
  );
};

export default GeneralApp;