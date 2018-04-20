<template>

  <div  v-on:click="flagCell(row, cell)"
        v-bind:class="{'is-bomb': isBomb, 'is-clean': !isBomb, 'is-flagged': isFlagged}"
        style="width:100%; height: 100%;">
    &nbsp;
  </div>

</template>

<script>

  import constants from '../constants';

  export default {
    name: 'Element',
    props: ['row', 'cell', 'grid'],
    data: function() {
      return {
        isBomb: false,
        isFlagged: false
      }
    },
    methods: {
      flagCell: function(row, cell) {

        if (this.isFlagged) return;

        this
          .$http
          .post(`${constants.baseApiUrl}/grids/${this.grid}/squares/${this.row}/${this.cell}/explore`, {
            rows: this.rows,
            cells: this.cells,
            mines: this.mines
          })
          .then(function (response) {

            this.isBomb = response.body.is_bomb;
            this.isFlagged = true;
            if (this.isBomb) {
              this.$root.$emit('game-over');
            }

          })
          .catch(function (error) {
            console.log(error)
          });
      }
    }
  }

</script>

<style>

  .is-bomb {
    background-color: red !important;
  }

  .is-clean {
    background-color: white;
  }

  .is-flagged {
    background-color: gray;
  }

</style>