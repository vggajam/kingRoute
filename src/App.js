
import './App.css';
import { useState, useEffect } from 'react';
import { Stack, Select, MenuItem, Button, ButtonGroup, Typography, FormControl, InputLabel, Slider, FormControlLabel, Checkbox } from '@mui/material';
import { FaChessKing, FaHome, FaSkullCrossbones } from 'react-icons/fa';
import { BsArrowDown, BsArrowUp, BsArrowRight, BsArrowLeft, BsArrowDownRight, BsArrowDownLeft, BsArrowUpLeft, BsArrowUpRight } from 'react-icons/bs';

const POS_START = 1;
const POS_END = 2;
const POS_OBST = 3;
const ArrowSize = 5;


const IconMapping = [
  [0, null],
  [1, <FaChessKing />],
  [2, <FaHome color="green" />],
  [3, <FaSkullCrossbones color="red" />]
];

const marks = [
  {
    value: 0.0,
    label: "Random",
  },
  {
    value: 1.0,
    label: 'Greedy',
  },
];
const DashBoard = ({ rows, cols }) => {

  const [grid, setGrid] = useState([]);
  const [qtable, setQtable] = useState([]);
  const [episodesDone, setEpisodesDone] = useState(0);
  const [showBestMoves, setShowBestMoves] = useState(false);
  const [epsilon, setEpsilon] = useState(0.8);
  const [negativeReward, setNegativeReward] = useState(-1000);
  const [positiveReward, setPositiveReward] = useState(1000);
  const [curEpisode, setCurEpisode] = useState([]);

  useEffect(() => {
    let tempArr = [];
    let qtabletemp = [];
    let tempCurEpisode = [];
    for (let row = 0; row < rows; row++) {
      tempArr.push([]);
      for (let col = 0; col < cols; col++) {
        tempArr[row].push(0);
        qtabletemp.push([]);
        tempCurEpisode.push(0);
        for (let act = 0; act < 8; act++)
          qtabletemp[row * cols + col].push(ArrowSize);
      }
    }
    setGrid(tempArr);
    setQtable(qtabletemp);
    setCurEpisode(tempCurEpisode);
  }, [rows, cols]);

  const UpdateGrid = (row_idx, col_idx, value) => {
    setGrid((prev) => {
      let tempArr = [];
      for (let row = 0; row < rows; row++) {
        tempArr.push([]);
        for (let col = 0; col < cols; col++) {
          if (row_idx === row && col_idx === col)
            tempArr[row].push(value);
          else
            tempArr[row].push(prev[row][col]);
        }
      }
      return tempArr;
    });
  };

  const runEpisodes = (episode_cnt) => {

    let king_row = -1, king_col = -1;
    const reset_episode = (firstTime = false) => {
      if (!firstTime) {
        episode_cnt--;
        setEpisodesDone(episodesDone + 1);
      }
      for (let row = 0; row < rows; row++)
        for (let col = 0; col < cols; col++) {
          if (grid[row][col] === POS_START) {
            king_row = row;
            king_col = col;
            curEpisode[row * cols + col] = 0;
          }
        }
    }
    reset_episode(true);
    while (episode_cnt) {
      // 0. check for end of episode
      if (king_row < 0 || king_col < 0 || king_row >= rows || king_col >= cols) {
        console.log("King went out of grid!!");
        return;
      }
      else if (grid[king_row][king_col] === POS_OBST || curEpisode[king_row * cols + king_col]) {
        // negative end

        // #TODO

        reset_episode();

      }
      else if (grid[king_row][king_col] === POS_END) {
        // positive end

        // #TODO

        reset_episode();

      }
      else {
        // 1. lets decide the next move
        let rand_num = Math.random();
        if (rand_num <= epsilon) {
          let best_move = -1;
          let best_q_val = -10000000000.0;
          qtable[king_row * cols + king_col].forEach((val, idx) => {
            if (val > best_q_val) {
              best_q_val = val;
              best_move = idx;
            }
          });
          // TODO
        }
        else {
          // TODO

        }
      }
    }
  }

  return <Stack spacing={5} direction="row" justifyContent="space-evenly" alignItems="center">
    <Stack spacing={5} width={500} >
      <Stack direction="row" alignItems="center" justifyContent="flex-start" >
        <Checkbox
          checked={showBestMoves}
          onChange={(e) => setShowBestMoves(e.target.checked)}
        />
        <Typography>Show Best Moves</Typography>
      </Stack>
      <Stack alignItems="flex-start" direction="row" spacing={2}>
        <Typography>Ⲉ:</Typography>
        <Slider
          valueLabelDisplay="on"
          aria-label="epsilon"
          value={epsilon}
          onChange={(e) => { setEpsilon(e.target.value) }}
          step={0.1}
          marks={marks}
          min={0.0}
          max={1.0}
        />
      </Stack>
      <Stack alignItems="center" direction="row" spacing={2}>
        <Typography fontSize={30}> Episodes: {episodesDone} </Typography>
        <ButtonGroup variant="outlined" aria-label="outlined button group">
          <Button onClick={() => { runEpisodes(1); }} >+ 1</Button>
          <Button onClick={() => { runEpisodes(10); }} >+ 10</Button>
          <Button onClick={() => { runEpisodes(100); }} >+ 100</Button>
          <Button onClick={() => { runEpisodes(1000); }} >+ 1000</Button>
        </ButtonGroup>

      </Stack>

    </Stack>
    <Stack>
      <table>
        <tbody>
          {
            grid.map((row, row_idx) => {
              return <tr key={row_idx}>{
                row.map((cell, col_idx) => {
                  console.log(qtable[row_idx * cols + col_idx]);
                  return <td key={row_idx * cols + col_idx}>
                    <table>
                      <tbody>
                        {showBestMoves ?
                          <tr>
                            <td>
                              <BsArrowUpLeft size={qtable[row_idx * cols + col_idx][0]} />
                            </td>
                            <td>
                              <BsArrowUp size={qtable[row_idx * cols + col_idx][1]} />
                            </td>
                            <td>
                              <BsArrowUpRight size={qtable[row_idx * cols + col_idx][2]} />
                            </td>
                          </tr> : null
                        }
                        <tr>

                          <td>
                            {showBestMoves ? <BsArrowLeft size={qtable[row_idx * cols + col_idx][3]} /> : null}
                          </td>
                          <td>
                            <Select size="small" style={{ width: 45 }} IconComponent={null} value={cell} onChange={(e) => { UpdateGrid(row_idx, col_idx, e.target.value); }} >
                              {IconMapping.map((ics) => <MenuItem key={ics[0]} value={ics[0]}>{ics[1]}</MenuItem>)}
                            </Select>
                          </td>
                          {showBestMoves ?
                            <td>
                              <BsArrowRight size={qtable[row_idx * cols + col_idx][4]} />
                            </td> : null
                          }
                        </tr>
                        {showBestMoves ?
                          <tr>
                            <td>
                              <BsArrowDownLeft size={qtable[row_idx * cols + col_idx][5]} />
                            </td>
                            <td>
                              <BsArrowDown size={qtable[row_idx * cols + col_idx][6]} />
                            </td>
                            <td>
                              <BsArrowDownRight size={qtable[row_idx * cols + col_idx][7]} />
                            </td>
                          </tr> : null
                        }
                      </tbody>
                    </table>
                  </td>;
                })
              }</tr>;

            })}
        </tbody>

      </table>
    </Stack>
  </Stack>

}

function App() {
  return (
    <div className="App">
      <DashBoard rows={6} cols={8} />
    </div>
  );
}

export default App;
