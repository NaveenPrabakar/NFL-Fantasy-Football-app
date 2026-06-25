package com.example.demo.Recent;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.ManyToOne;
import com.example.demo.User.User;
import jakarta.persistence.JoinColumn;
import java.time.LocalDateTime;

// Recent class to see which players someone has searched up recently
@Entity
@Table(name = "recent")
public class Recent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @Column
    private String searchedPlayer;

    @Column
    private LocalDateTime timestamp;

    public Recent() {
    }

    public Recent(User user, String searchedPlayer, LocalDateTime timestamp) {
        this.user = user;
        this.searchedPlayer = searchedPlayer;
        this.timestamp = timestamp;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPlayer() {
        return searchedPlayer;
    }

    public String SetPlayer(String searchedPlayer) {
        this.searchedPlayer = searchedPlayer;
        return searchedPlayer;
    }

}