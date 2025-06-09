import { md5 } from "./md5.js";

class Gravatar {
  constructor() {
    this.initializeElements();
    this.bindEvents();
  }

  initializeElements() {
    this.authForm = document.getElementById("authForm");
    this.profileSection = document.getElementById("profileSection");
    this.emailInput = document.getElementById("email");
    this.submitButton = document.getElementById("submitButton");
    this.buttonText = document.getElementById("buttonText");
    this.loadingSpinner = document.getElementById("loadingSpinner");
    this.errorMessage = document.getElementById("errorMessage");
    this.profileAvatar = document.getElementById("profileAvatar");
    this.profileEmail = document.getElementById("profileEmail");
    this.reposGrid = document.getElementById("reposGrid");
    this.backButton = document.getElementById("backButton");
    this.reposSection = document.getElementById("reposSection");
  }

  bindEvents() {
    this.submitButton.addEventListener("click", (e) => {
      e.preventDefault();
      this.handleSubmit();
    });

    this.emailInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        this.handleSubmit();
      }
    });

    this.backButton.addEventListener("click", () => {
      this.showAuthForm();
    });
  }

  async handleSubmit() {
    const email = this.emailInput.value.trim();

    if (!email) {
      this.showError("Please enter an email address");
      return;
    }

    if (!this.isValidEmail(email)) {
      this.showError("Please enter a valid email address");
      return;
    }

    this.hideError();
    this.setLoading(true);

    try {
      await this.fetchUserData(email);
    } catch (error) {
      this.showError(
        "An error occurred while fetching data. Please try again."
      );
      console.error("Error:", error);
    } finally {
      this.setLoading(false);
    }
  }

  async fetchUserData(email) {
    console.log("Fetching user data for email:", email);

    const gravatarHash = this.generateGravatarHash(email);
    const gravatarUrl = `https://www.gravatar.com/avatar/${gravatarHash}?s=400&d=mp`;

    const githubUsername = this.extractUsernameFromEmail(email);
    let repos = [];

    if (githubUsername) {
      try {
        repos = await this.fetchGitHubRepos(githubUsername);
      } catch (error) {
        console.log("GitHub data not found for this email");
      }
    }

    this.displayProfile(email, gravatarUrl, repos);
  }

  generateGravatarHash(email) {
    const normalizedEmail = email.toLowerCase().trim();
    return md5(normalizedEmail);
  }

  extractUsernameFromEmail(email) {
    const domain = email.split("@")[1];
    const username = email.split("@")[0];
    return username.replace(/[^a-zA-Z0-9-]/g, "");
  }

  async fetchGitHubRepos(username) {
    try {
      const response = await fetch(
        `https://api.github.com/users/${username}/repos?sort=updated&per_page=10`
      );

      if (!response.ok) {
        throw new Error("GitHub user not found");
      }

      const repos = await response.json();
      return repos.filter((repo) => !repo.fork).slice(0, 6); // Show only original repos, max 6
    } catch (error) {
      console.log("Error fetching GitHub repos:", error);
      return [];
    }
  }

  displayProfile(email, gravatarUrl, repos) {
    this.profileAvatar.src = gravatarUrl;
    this.profileEmail.textContent = email;

    this.displayRepos(repos);
    this.showProfile();
  }

  displayRepos(repos) {
    this.reposGrid.innerHTML = "";

    if (repos.length === 0) {
      this.reposGrid.innerHTML =
        '<div class="no-repos">No public repositories found</div>';
      return;
    }

    repos.forEach((repo) => {
      const repoCard = document.createElement("div");
      repoCard.className = "repo-card";

      const languageColor = this.getLanguageColor(repo.language);

      repoCard.innerHTML = `
                <a href="${repo.html_url}" target="_blank" class="repo-name">${
        repo.name
      }</a>
                <div class="repo-description">${
                  repo.description || "No description available"
                }</div>
                <div class="repo-meta">
                    ${
                      repo.language
                        ? `
                        <span>
                            <div class="language-dot" style="background-color: ${languageColor}"></div>
                            ${repo.language}
                        </span>
                    `
                        : ""
                    }
                    <span>⭐ ${repo.stargazers_count}</span>
                    <span>🍴 ${repo.forks_count}</span>
                    <span>📅 ${new Date(
                      repo.updated_at
                    ).toLocaleDateString()}</span>
                </div>
            `;

      this.reposGrid.appendChild(repoCard);
    });
  }

  getLanguageColor(language) {
    const colors = {
      JavaScript: "#f1e05a",
      TypeScript: "#3178c6",
      HTML: "#e34c26",
      CSS: "#1572B6",
    };
    return colors[language] || "#8257e6";
  }

  setLoading(isLoading) {
    this.submitButton.disabled = isLoading;
    this.buttonText.style.display = isLoading ? "none" : "inline";
    this.loadingSpinner.style.display = isLoading ? "block" : "none";
  }

  showError(message) {
    this.errorMessage.textContent = message;
    this.errorMessage.classList.add("show");
  }

  hideError() {
    this.errorMessage.classList.remove("show");
  }

  showProfile() {
    this.authForm.style.display = "none";
    this.profileSection.classList.add("show");
  }

  showAuthForm() {
    this.profileSection.classList.remove("show");
    this.authForm.style.display = "block";
    this.emailInput.value = "";
    this.hideError();
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new Gravatar();
});
