<template>
  <div>
    <h1 v-html="$page.project.title" />
    <div v-html="$page.project.content" />
  </div>
</template>

<page-query>
query ($id: ID!) {
  project(id: $id) {
    title
    content
  }
}
</page-query>