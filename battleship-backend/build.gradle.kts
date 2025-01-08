plugins {
	java
	id("org.springframework.boot") version "3.4.1"
	id("io.spring.dependency-management") version "1.1.7"
	id("com.gorylenko.gradle-git-properties") version "2.4.1"
}

group = "be.kdg.int5"
version = "0.0.1-SNAPSHOT"

java {
	toolchain {
		languageVersion = JavaLanguageVersion.of(21)
	}
}

repositories {
	mavenCentral()
}

dependencies {
	implementation("org.springframework.boot:spring-boot-starter-web")
	implementation("org.springframework.boot:spring-boot-starter-validation")
	implementation("org.springframework.boot:spring-boot-starter-security")

	implementation(files("libs/bandit-sdk-1.0.0.jar"))

	testImplementation("org.springframework.boot:spring-boot-starter-test")
	testImplementation("org.springframework.security:spring-security-test")
	testRuntimeOnly("org.junit.platform:junit-platform-launcher")

	//Spring cloud AZURE
	implementation("com.azure.spring:spring-cloud-azure-starter-actuator:4.3.0")
	implementation("com.azure.spring:spring-cloud-azure-starter-keyvault:4.3.0")
	implementation("com.azure.spring:spring-cloud-azure-starter:4.3.0")
	implementation("com.azure.spring:spring-cloud-azure-dependencies:5.7.0")
}

tasks.withType<Test> {
	useJUnitPlatform()
}

project.ext["gitProps"] = mapOf(
	"git.commit.id.abbrev" to "null"
)

tasks.named("generateGitProperties") {
	outputs.upToDateWhen { false }
}

tasks.register("printGitProperties") {
	dependsOn("generateGitProperties")
	doLast {
		val gitProps = project.extra["gitProps"]
		if (gitProps is Map<*, *>) {
			println("git.commit.id.abbrev=${gitProps["git.commit.id.abbrev"]}")
		} else {
			println("nothing found")
		}
	}
}

tasks.named<org.springframework.boot.gradle.tasks.bundling.BootBuildImage>("bootBuildImage") {
	builder.set("paketobuildpacks/builder-jammy-base:latest")
	imageName.set("acrbattleshipgame.azurecr.io/backend")
	tags.set(
		listOf(
			"acrbattleshipgame.azurecr.io/backend:${(project.ext["gitProps"] as? Map<*, *>)?.get("git.commit.id.abbrev")}"
		)
	)
	publish.set(true)
	docker {
		publishRegistry {
			username.set(System.getenv("GAME_REGISTRY_USERNAME"))
			password.set(System.getenv("GAME_REGISTRY_PASSWORD"))
		}
	}
	archiveFile.set(tasks.getByName<org.springframework.boot.gradle.tasks.bundling.BootJar>("bootJar").archiveFile)
}

tasks.named("bootBuildImage") {
	dependsOn("generateGitProperties")
}
