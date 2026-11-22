<script lang="ts">
	import Hero from '#lib/components/Hero.svelte';
	import FeaturedProjects from '#lib/components/FeaturedProjects.svelte';
	import SkillsMatrix from '#lib/components/SkillsMatrix.svelte';
	import ExperienceTimeline from '#lib/components/ExperienceTimeline.svelte';
	import ContactSection from '#lib/components/ContactSection.svelte';
	import Footer from '#lib/components/Footer.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Rizki Arkant Pratama (Kantz) — Software Engineer Portfolio</title>
	<meta
		name="description"
		content="Software developer specializing in performant web architecture, low-level systems engineering, and modern reactive interfaces."
	/>
</svelte:head>

<Hero />
<FeaturedProjects projects={data.featuredProjects} />
<SkillsMatrix skills={data.skills} />
<ExperienceTimeline experiences={data.experiences} />
<ContactSection />
<Footer />
