<template>

  <div>

    <a href="#" v-on:click="logout()">Logout</a>

    <div class="container">

      <div class="row">

        <div class="col-4">

          <div v-if="showError">{{ errorMessage }}</div>

          <div class="row">
            <span>Rows: </span>
            <select class="custom-select" v-model="rows">
              <option  v-for="item in 10">{{ item }}</option>
            </select>
          </div>

          <div class="row">
            <span>Cells: </span>
            <select class="custom-select" v-model="cells">
              <option v-for="item in 10">{{ item }}</option>
            </select>
          </div>

          <div class="row">
            <span>Mines: </span>
            <select class="custom-select" v-model="mines">
              <option v-for="item in 10">{{ item }}</option>
            </select>
          </div>

          <br>

          <button v-on:click="play" v-if="!showError" type="button" class="btn btn-info">Play</button>

          <div v-if="olderGames">

            <h4>Older Games</h4>

            <div class="list-group">

              <a href="#"
                class="list-group-item list-group-item-action"
                v-for="game in olderGames"
                v-on:click="loadGame(game)">

                Date: {{ game.datetime }} -
                Rows: {{ game.rows }} -
                Cells: {{ game.cells }} -
                Mines: {{ game.mines }}

              </a>

            </div>

          </div>

        </div>

        <div class="col-8">

          <div v-if="gameOver && !gameFinished">
            Game Over!!!!
          </div>

          <div v-if="gameFinished">
            Game Finished!!!
          </div>

          <div v-if="startTime && !gameOver">

            <p>
              <span>Game started - {{ startTime }}</span><br>
              <button type="button" class="btn btn-danger" v-on:click="deleteGame(grid)">Delete</button>
            </p>

            <div class="alert alert-danger" v-if="timeIsAlmostDone" role="alert">
              Time is almost done!!!!
            </div>

            <table border="1" style="width: 100%">
              <tr v-for="(i, row) in rows" class="g-row">
                <td v-for="(j, cell) in cells" class="g-cell">
                  <Element
                    v-bind:grid="grid"
                    v-bind:key="row-cell"
                    v-bind:row="row"
                    v-bind:cell="cell"
                  />
                </td>
              </tr>
            </table>

          </div>

        </div>

      </div>

    </div>

  </div>

</template>

<script>

  import Element from './Element.vue';
  import constants from '../constants';
  const Stopwatch = require('timer-stopwatch');

  export default {
    name: 'MineSweeper',
    props: {
      msg: String
    },
    components: {
      Element
    },
    data:() => {

      return {
        startTime: '',
        rows: 5,
        cells: 5,
        mines: 5,
        grid: 0,
        gameOver: false,
        olderGames: false,
        gameFinished: false,
        showError: false,
        errorMessage: '',
        timeIsAlmostDone: false
      }

    },
    watch: {
      rows: function(newVal, oldVal) {
        this.rows = ~~this.rows;
        this.validateNumberOfMines();
      },
      cells: function(newVal, oldVal) {
        this.cells = ~~this.cells;
        this.validateNumberOfMines();
      },
      mines: function(newVal, oldVal) {
        this.validateNumberOfMines();
      }
    },
    mounted() {

      this.$root.$on('flag-cell', (isBomb) => {

        if (this.gameFinished) return;

        this.gameOver = isBomb;
        const cleanElements = this.rows * this.cells - this.mines;
        const flaggedCells = document.querySelectorAll('.is-flagged');
        this.gameFinished = (cleanElements === flaggedCells.length) && !this.gameOver;

        if (this.gameOver || this.gameFinished) {
          this.stopTimer();
        }

      });

      // Get older games for logged in user
      this
        .$http
        .get(`${constants.baseApiUrl}/grids/`)
        .then((response) => {
          this.olderGames = response.body;
        });

    },
    methods: {

      logout: function() {
        delete localStorage.token;
        this.$router.push('/login');
      },

      /**
       * Number of mines can't be greater than
       * the grid number of elements
      */
      validateNumberOfMines: function() {
        if (this.mines > (this.rows * this.cells)) {
          this.showError = true;
          this.errorMessage = "The number of mines can't be greather than the grid number of elements";
        } else {
          this.showError = false;
        }
      },

      /**
       * Load an older game
       * Re render a grid with the specified game specs
      */
      loadGame: function(game) {

        this
          .$http
          .get(`${constants.baseApiUrl}/grids/${game.pk}`)
          .then((response) => {

            const grid = response.body;

            // Restart game removing game over flag
            this.gameOver = false;
            this.gameFinished = false;

            // Set up a new start date
            this.startTimer();

            // Set up game data
            this.grid = grid.pk;
            this.cells = grid.cells;
            this.rows = grid.rows;
            this.mines = grid.mines;

          })

      },

      /**
       * Delete a new game
       * with specified id
      */
      deleteGame: function(gameId) {

        this
          .$http
          .delete(`${constants.baseApiUrl}/grids/${gameId}`)
          .then(function(response) {

            this.startTime = null;

            // Search game in list
            const olderGameIndex = this.olderGames.findIndex(game => game.pk === gameId);

            // Remove the game from the list
            this.olderGames.splice(olderGameIndex, 1);

          });

      },

      stopTimer: function() {
        this.timer.stop();
      },

      startTimer: function() {

        const options = {
          refreshRateMS: 100,		// How often the clock should be updated
          almostDoneMS: 10000, 	// When counting down - this event will fire with this many milliseconds remaining on the clock
        }

        this.timer = new Stopwatch(60000, options);

        this.timer.start()

        var that = this;

        this.timer.onTime(function(time) {
          that.startTime = parseFloat(time.ms / 1000).toFixed(2);
          if (that.startTime <= 10) {
            that.timeIsAlmostDone = true;
          }
        });

        // Fires when the timer is done
        this.timer.onDone(function(){
          that.gameFinished = !that.gameOver;
        });

        // Fires when the timer is almost complete - default is 10 seconds remaining. Change with 'almostDoneMS' option
        this.timer.onAlmostDone(function() {
          that.timeIsAlmostDone = true;
        });

      },

      /**
       * Start a new game
       * with specified rows, cells and mines arguments
      */
      play: function() {

        this
          .$http
          .post(`${constants.baseApiUrl}/grids/`, {
            rows: this.rows,
            cells: this.cells,
            mines: this.mines
          })
          .then((response) => {
            // Save grid pk to be passed in to the elements
            this.grid = response.body.pk;
            this.gameOver = false;
            this.gameFinished = false;
            this.startTimer();
          });

      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.g-row {
  border: solid 1px gray;
  border-bottom: none;
}

.g-cell {
  cursor: pointer;
  padding: 0;
  border: solid 1px lightgrey;
}

h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
