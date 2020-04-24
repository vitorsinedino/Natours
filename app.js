const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(express.json());
const port = 3000;

//middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use((req, res, next) => {
  console.log('hello from the middlware');
  next();
});

app.use(morgan('dev'));

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

//route handlers
getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    date: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};

postNewTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

getTour = (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    res.status(404).json({
      status: 'Fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Tour updated...>',
    },
  });
};

deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    res(404).json({
      status: 'fail',
      message: 'invalid ID',
    });
  }
  res(204).json({
    status: 'success',
    data: null,
  });
};

//routes
app.route('/api/v1/tours').get(getAllTours).post(postNewTour);

app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

//server start
app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});
