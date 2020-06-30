<template>
  <section>
    <h1>Clients</h1>
    <v-card class="elevation-12">
      <v-data-table :headers="headers" :items="clients" :items-per-page="5" class="elevation-1"></v-data-table>
    </v-card>
  </section>
</template>

<script>
const url = `${process.env.VUE_APP_API_URL}/clients`;
export default {
  name: "clients",
  data: () => ({
    clients: [],
    headers: []
  }),
  mounted() {
    this.getClients();
  },
  methods: {
    getClients() {
      fetch(url, { method: "GET", credentials: "include" })
        //.then(res => res.json())
        .then(async res => {          
          if (!res.ok) {
            const error = (result && result.message) || res.statusText;
            return Promise.reject(error);
          }
          const result = await res.json();
          Object.keys(result[0]).forEach((key, val) => {
            this.headers.push({ text: `${key}`, value: `${key}` });
          });
          this.clients = result;
        })
        .catch(error => {
          if (error === "Unauthorized") {
            this.$router.push("/login");
          }
        });
    }
  }
};
</script>

<style lang="scss" scoped>
section {
  width: 50%;
}
</style>
