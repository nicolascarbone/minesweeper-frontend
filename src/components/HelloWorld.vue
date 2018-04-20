<template>

  <div>

    <div class="container">

      <div v-if="olderGames">
        <h4>Older Games</h4>
        <ul>
          <li v-for="game in olderGames">
            <a v-on:click="loadGame(game)">
              Date: {{ game.datetime }} -
              Rows: {{ game.rows }} -
              Cells: {{ game.cells }} -
              Mines: {{ game.mines }}
            </a>
          </li>
        </ul>
      </div>

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

    </div>

    <br/>

    <button v-on:click="play" type="button" class="btn btn-info">Play</button>

    <br/><br/>

    <div v-if="gameOver && !gameFinished">
      Game Over!!!!
    </div>

    <div v-if="gameFinished">
      Game Finished!!!!
    </div>

    <div v-if="startTime && !gameOver">

      <p>Game started at {{ startTime }}</p>

      <div class="container">
        <div v-for="(i, row) in rows" class="g-row row">
          <div v-for="(j, cell) in cells" class="g-cell col">
            <Element
              v-bind:grid="grid"
              v-bind:key="row-cell"
              v-bind:row="row"
              v-bind:cell="cell"
            />
          </div>
        </div>
      </div>

    </div>

  </div>

</template>

<script>

  import Element from './Element.vue';
  import constants from '../constants';

  export default {
    name: 'HelloWorld',
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
        gameFinished: false
      }

    },
    watch: {
      rows: (newVal, oldVal) => {
        this.rows = ~~this.rows;
      },
      cells: (newVal, oldVal) => {
        this.cells = ~~this.cells;
      }
    },
    mounted() {

      this.$root.$on('flag-cell', (isBomb) => {


        this.gameOver = isBomb;
        const cleanElements = this.rows * this.cells - this.mines;
        const flaggedCells = document.querySelectorAll('.is-flagged');
        this.gameFinished = (cleanElements === flaggedCells.length);

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

            // Set up a new start date
            this.startTime = new Date();

            // Set up game data
            this.grid = grid.pk;
            this.cells = grid.cells;
            this.rows = grid.rows;
            this.mines = grid.mines;

          })

      },
      /**
       * Start a new game
       * with specified rows, cells and mines arguments
      */
      play: function() {

        this.startTime = new Date();

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
          })
          .catch((error) => {
            console.log(error)
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
  border: solid 1px gray;
  /* border-bottom: none; */
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
