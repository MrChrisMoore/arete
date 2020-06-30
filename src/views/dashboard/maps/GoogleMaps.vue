<template>
  <v-container id="google-maps" fluid tag="section">
    <v-row>
      <v-col cols="12">
        <base-material-card color="success" title="Locations" class="px-5 py-3">
          <v-card-text class="px-0 pb-0">
            <v-sheet>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d97870.41667815264!2d-83.16782622223823!3d39.95367897363331!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sfst%20logistics!5e0!3m2!1sen!2sus!4v1593186677284!5m2!1sen!2sus"
                width="100%"
                height="800"
                frameborder="0"
                style="border:0;"
                allowfullscreen
                aria-hidden="false"
                tabindex="0"
              ></iframe>
            </v-sheet>
          </v-card-text>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>
